import { hasTwilio } from "./config";

export async function sendMessage(
  to: string,
  body: string,
  _leadId?: string
): Promise<{ queued: boolean; sid?: string }> {
  if (!hasTwilio) return { queued: true };
  // TODO: Twilio API
  return { queued: true, sid: "stub" };
}
