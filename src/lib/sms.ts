import { env } from "./env";

export type SmsSendResult = { ok: true } | { ok: false; error: string };

export function isSmsConfigured() {
  return Boolean(env.twilioAccountSid && env.twilioAuthToken && env.twilioFromNumber);
}

export function smsConfigHint() {
  if (isSmsConfigured()) return null;
  return "Configurez TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN et TWILIO_FROM_NUMBER pour activer la vérification SMS.";
}

export async function sendSms(to: string, body: string): Promise<SmsSendResult> {
  if (!isSmsConfigured()) {
    return { ok: false, error: smsConfigHint() ?? "Service SMS non configuré." };
  }

  const auth = Buffer.from(`${env.twilioAccountSid}:${env.twilioAuthToken}`).toString("base64");
  const params = new URLSearchParams({ To: to, From: env.twilioFromNumber, Body: body });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.twilioAccountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return {
      ok: false,
      error: `Twilio a refusé l'envoi (${response.status})${detail ? `: ${detail.slice(0, 160)}` : ""}.`,
    };
  }

  return { ok: true };
}
