import { createHmac, randomBytes } from "crypto";
import { CodeChallengeMethod, OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { PlatformRole, Prisma } from "@prisma/client";
import { appendQuery, sanitizeInternalReturnTo } from "./oauth-redirect";
import { writeAudit } from "./audit";
import { env, isGoogleAuthConfigured, isProduction } from "./env";
import { clientIp, userAgent } from "./http";
import { hashPassword } from "./password";
import { prisma } from "./prisma";
import { createSession } from "./session";

const PROVIDER = "google";
const STATE_COOKIE = "fidelo_google_oauth_state";
const STATE_TTL_SECONDS = 10 * 60;
const GOOGLE_SCOPES = ["openid", "email", "profile"];

export type GoogleAuthIntent = {
  flow: "login" | "register";
  slug?: string;
  returnTo: string;
  privacyConsent: boolean;
};

type StoredGoogleState = GoogleAuthIntent & {
  state: string;
  nonce: string;
  codeVerifier: string;
  createdAt: number;
};

type GoogleProfile = {
  sub: string;
  email: string;
  emailVerified: boolean;
  givenName?: string | null;
  familyName?: string | null;
  picture?: string | null;
};

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    (typeof error === "object" && error !== null && "code" in error)
  ) && (error as { code?: unknown }).code === "P2002";
}

export type GoogleCallbackResult =
  | { ok: true; redirectTo: string; userId: string; isNewUser: boolean }
  | { ok: false; redirectTo: string; reason: string };

function stateCookieOptions(maxAge = STATE_TTL_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction(),
    path: "/",
    maxAge,
  };
}

function stateSecret() {
  return `${env.qrSecret}:${env.googleClientSecret || "google-oauth-dev"}`;
}

function signState(payload: string) {
  return createHmac("sha256", stateSecret()).update(payload).digest("base64url");
}

function encodeStateCookie(state: StoredGoogleState) {
  const payload = Buffer.from(JSON.stringify(state), "utf8").toString("base64url");
  return `${payload}.${signState(payload)}`;
}

function decodeStateCookie(value: string | undefined) {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || signState(payload) !== signature) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as StoredGoogleState;
    if (Date.now() - decoded.createdAt > STATE_TTL_SECONDS * 1000) return null;
    if (!decoded.state || !decoded.nonce || !decoded.codeVerifier) return null;
    return decoded;
  } catch {
    return null;
  }
}

function googleClient(origin: string) {
  return new OAuth2Client({
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    redirectUri: googleRedirectUri(origin),
  });
}

export function googleRedirectUri(origin: string) {
  return `${origin.replace(/\/$/, "")}/api/auth/google/callback`;
}

export function isGoogleSignInEnabled() {
  return isGoogleAuthConfigured();
}

export async function createGoogleAuthUrl(origin: string, intent: Partial<GoogleAuthIntent>) {
  if (!isGoogleAuthConfigured()) {
    return { ok: false as const, reason: "configuration_absente" };
  }

  const client = googleClient(origin);
  const verifier = await client.generateCodeVerifierAsync();
  const state: StoredGoogleState = {
    flow: intent.flow === "register" ? "register" : "login",
    slug: intent.slug?.trim() || undefined,
    returnTo: sanitizeInternalReturnTo(intent.returnTo, intent.slug ? `/carte/${intent.slug}` : "/carte"),
    privacyConsent: intent.privacyConsent === true,
    state: randomBytes(24).toString("base64url"),
    nonce: randomBytes(24).toString("base64url"),
    codeVerifier: verifier.codeVerifier,
    createdAt: Date.now(),
  };

  const jar = await cookies();
  jar.set(STATE_COOKIE, encodeStateCookie(state), stateCookieOptions());

  return {
    ok: true as const,
    url: client.generateAuthUrl({
      access_type: "online",
      prompt: "select_account",
      scope: GOOGLE_SCOPES,
      state: state.state,
      nonce: state.nonce,
      code_challenge: verifier.codeChallenge,
      code_challenge_method: CodeChallengeMethod.S256,
    }),
  };
}

export async function consumeGoogleCallback(req: Request, origin: string): Promise<GoogleCallbackResult> {
  const url = new URL(req.url);
  const jar = await cookies();
  const stored = decodeStateCookie(jar.get(STATE_COOKIE)?.value);
  jar.set(STATE_COOKIE, "", stateCookieOptions(0));

  const fallback = stored?.slug ? `/rejoindre/${stored.slug}` : "/connexion";
  if (url.searchParams.get("error")) {
    return { ok: false, redirectTo: appendQuery(fallback, "google", "cancelled"), reason: "cancelled" };
  }
  if (!isGoogleAuthConfigured()) {
    return { ok: false, redirectTo: appendQuery(fallback, "google", "configuration_absente"), reason: "configuration_absente" };
  }
  if (!stored || url.searchParams.get("state") !== stored.state) {
    return { ok: false, redirectTo: appendQuery("/connexion", "google", "state_invalide"), reason: "state_invalide" };
  }

  const code = url.searchParams.get("code");
  if (!code) {
    return { ok: false, redirectTo: appendQuery(fallback, "google", "erreur"), reason: "missing_code" };
  }

  try {
    const client = googleClient(origin);
    const { tokens } = await client.getToken({ code, codeVerifier: stored.codeVerifier });
    if (!tokens.id_token) {
      return { ok: false, redirectTo: appendQuery(fallback, "google", "erreur"), reason: "missing_id_token" };
    }
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      return { ok: false, redirectTo: appendQuery(fallback, "google", "email_absent"), reason: "email_absent" };
    }
    if (payload.nonce && payload.nonce !== stored.nonce) {
      return { ok: false, redirectTo: appendQuery(fallback, "google", "state_invalide"), reason: "nonce_invalide" };
    }
    return signInWithGoogleProfile(
      {
        sub: payload.sub,
        email: payload.email.toLowerCase(),
        emailVerified: payload.email_verified === true,
        givenName: payload.given_name ?? null,
        familyName: payload.family_name ?? null,
        picture: payload.picture ?? null,
      },
      stored,
      { ip: clientIp(req), userAgent: userAgent(req) },
    );
  } catch (error) {
    console.error("[google-auth] Callback error:", error instanceof Error ? error.message : "unknown");
    return { ok: false, redirectTo: appendQuery(fallback, "google", "erreur"), reason: "callback_error" };
  }
}

export async function signInWithGoogleProfile(
  profile: GoogleProfile,
  intent: GoogleAuthIntent,
  meta: { ip?: string; userAgent?: string } = {},
): Promise<GoogleCallbackResult> {
  const fallback = intent.slug ? `/rejoindre/${intent.slug}` : "/connexion";
  if (!profile.email || !profile.emailVerified) {
    return { ok: false, redirectTo: appendQuery(fallback, "google", "email_non_verifie"), reason: "email_non_verifie" };
  }

  const linked = await prisma.oAuthAccount.findUnique({
    where: { provider_providerAccountId: { provider: PROVIDER, providerAccountId: profile.sub } },
    include: { user: true },
  });
  if (linked) {
    if (!linked.user.isActive) {
      return { ok: false, redirectTo: appendQuery(fallback, "google", "erreur"), reason: "inactive_user" };
    }
    await createSession(linked.userId, meta);
    await writeAudit({ actorId: linked.userId, action: "GOOGLE_LOGIN", ip: meta.ip, userAgent: meta.userAgent });
    return { ok: true, redirectTo: sanitizeInternalReturnTo(intent.returnTo), userId: linked.userId, isNewUser: false };
  }

  const existing = await prisma.user.findUnique({ where: { email: profile.email } });
  if (existing) {
    return {
      ok: false,
      redirectTo: appendQuery(fallback, "google", "compte_existant"),
      reason: "compte_existant",
    };
  }

  if (intent.flow !== "register" || !intent.privacyConsent) {
    return {
      ok: false,
      redirectTo: appendQuery(fallback, "google", "consentement_requis"),
      reason: "consentement_requis",
    };
  }

  const merchant = intent.slug
    ? await prisma.merchant.findUnique({ where: { slug: intent.slug }, include: { program: true } })
    : null;
  if (intent.slug && (!merchant || !merchant.isActive || !merchant.program)) {
    return { ok: false, redirectTo: appendQuery(fallback, "google", "invitation_invalide"), reason: "invalid_slug" };
  }

  const firstName = profile.givenName?.trim() || profile.email.split("@")[0] || "Client";
  const randomPassword = randomBytes(48).toString("base64url");
  let user: { id: string };
  try {
    user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: profile.email,
          passwordHash: await hashPassword(randomPassword),
          firstName,
          lastName: profile.familyName?.trim() || null,
          avatarUrl: profile.picture?.trim() || null,
          platformRole: PlatformRole.CUSTOMER,
          privacyConsentAt: new Date(),
          customerMemberships: merchant ? { create: { merchantId: merchant.id } } : undefined,
        },
      });
      await tx.oAuthAccount.create({
        data: {
          userId: created.id,
          provider: PROVIDER,
          providerAccountId: profile.sub,
          email: profile.email,
          emailVerified: true,
        },
      });
      return created;
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const account = await prisma.oAuthAccount.findUnique({
        where: { provider_providerAccountId: { provider: PROVIDER, providerAccountId: profile.sub } },
        include: { user: true },
      });
      if (account?.user.isActive) {
        await createSession(account.userId, meta);
        return { ok: true, redirectTo: sanitizeInternalReturnTo(intent.returnTo), userId: account.userId, isNewUser: false };
      }
      return {
        ok: false,
        redirectTo: appendQuery(fallback, "google", "compte_existant"),
        reason: "compte_existant",
      };
    }
    throw error;
  }

  await createSession(user.id, meta);
  await writeAudit({
    actorId: user.id,
    merchantId: merchant?.id,
    action: merchant ? "GOOGLE_CUSTOMER_REGISTER" : "GOOGLE_REGISTER",
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  return {
    ok: true,
    redirectTo: sanitizeInternalReturnTo(intent.returnTo, merchant ? `/carte/${merchant.slug}` : "/carte"),
    userId: user.id,
    isNewUser: true,
  };
}
