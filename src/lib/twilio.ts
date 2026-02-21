import { env } from "./env.mjs";
import { hasTwilio } from "./config";

interface SendSmsInput {
  to: string;
  body: string;
  from?: string;
}

interface SendSmsResult {
  queued: boolean;
  sid?: string;
}

/**
 * Send an SMS via Twilio REST API.
 * If Twilio is not configured, returns a stub response.
 */
export async function sendSms({ to, body, from }: SendSmsInput): Promise<SendSmsResult> {
  if (!hasTwilio) {
    console.warn("[twilio] Not configured — returning stub");
    return { queued: true, sid: undefined };
  }

  const accountSid = env.server.TWILIO_ACCOUNT_SID;
  const authToken = env.server.TWILIO_AUTH_TOKEN;
  const fromNumber = from ?? env.server.TWILIO_FROM_NUMBER;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams({
    To: to,
    From: fromNumber,
    Body: body,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[twilio] Send failed:", res.status, err);
    throw new Error(`Twilio send failed: ${res.status}`);
  }

  const data = (await res.json()) as { sid: string; status: string };
  return { queued: true, sid: data.sid };
}

/**
 * Backward-compatible wrapper used by existing /api/messages/send route.
 * Delegates to sendSms().
 */
export async function sendMessage(
  to: string,
  body: string,
  _leadId?: string,
): Promise<{ queued: boolean; sid?: string }> {
  return sendSms({ to, body });
}
