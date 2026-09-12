import { readFile } from "fs/promises";
import { GoogleAuth } from "google-auth-library";
import { env } from "../src/lib/env";
import { googleWalletLogoUrl } from "../src/lib/google-wallet";

const WALLET_SCOPE = "https://www.googleapis.com/auth/wallet_object.issuer";
const WALLET_API = "https://walletobjects.googleapis.com/walletobjects/v1";

function ok(label: string) {
  console.log(`${label} : OK`);
}

function fail(label: string, message: string): never {
  console.error(`${label} : ERREUR`);
  console.error(message.replace(/private_key|access_token|refresh_token/gi, "[redacted]"));
  process.exit(1);
}

async function accessToken() {
  const auth = new GoogleAuth({
    keyFile: env.googleWalletServiceAccountFile,
    scopes: [WALLET_SCOPE],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const value = typeof token === "string" ? token : token?.token;
  if (!value) fail("Authentification", "Jeton OAuth absent.");
  return value;
}

function pngSize(buffer: Buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

async function main() {
  if (!env.googleWalletEnabled) fail("Configuration", "GOOGLE_WALLET_ENABLED doit valoir true sur le VPS de test.");
  if (!env.googleWalletIssuerId) fail("Configuration", "GOOGLE_WALLET_ISSUER_ID manquant.");
  if (!env.googleWalletGlobalClassId) fail("Configuration", "GOOGLE_WALLET_GLOBAL_CLASS_ID manquant.");
  if (!env.googleServiceAccountEmail) fail("Configuration", "GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL manquant.");
  if (!env.googleWalletServiceAccountFile) fail("Configuration", "GOOGLE_WALLET_SERVICE_ACCOUNT_FILE manquant.");

  let credentials: { client_email?: string };
  try {
    credentials = JSON.parse(await readFile(env.googleWalletServiceAccountFile, "utf8")) as { client_email?: string };
  } catch {
    fail("Configuration", "Fichier JSON inaccessible ou invalide.");
  }
  if (credentials.client_email !== env.googleServiceAccountEmail) {
    fail("Configuration", "L'e-mail du compte de service ne correspond pas à la configuration.");
  }
  ok("Configuration");

  const token = await accessToken();
  ok("Authentification");

  const classResponse = await fetch(
    `${WALLET_API}/loyaltyClass/${encodeURIComponent(env.googleWalletGlobalClassId)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!classResponse.ok) {
    fail("Classe générale", `Classe inaccessible, statut HTTP ${classResponse.status}.`);
  }
  const loyaltyClass = (await classResponse.json()) as { id?: string; reviewStatus?: string };
  if (loyaltyClass.id !== env.googleWalletGlobalClassId) {
    fail("Classe générale", "Identifiant de classe retourné inattendu.");
  }
  console.log(`Classe générale : OK (${loyaltyClass.reviewStatus ?? "état inconnu"})`);

  const logoResponse = await fetch(googleWalletLogoUrl(), { cache: "no-store" });
  if (!logoResponse.ok) fail("Logo", `Logo inaccessible, statut HTTP ${logoResponse.status}.`);
  const contentType = logoResponse.headers.get("content-type") ?? "";
  if (!contentType.includes("image/png")) fail("Logo", `Content-Type inattendu : ${contentType}`);
  const size = pngSize(Buffer.from(await logoResponse.arrayBuffer()));
  if (!size) fail("Logo", "Le logo public n'est pas un PNG valide.");
  if (size.width !== size.height || size.width < 660) {
    fail("Logo", `Dimensions invalides : ${size.width} x ${size.height}.`);
  }
  ok("Logo");

  console.log("Prêt pour les tests : OUI");
}

main().catch((error) => fail("Diagnostic", error instanceof Error ? error.message : "Erreur inconnue."));
