import { hasMake } from "./config";
import { env } from "./env.mjs";

export async function triggerWebhook(payload: unknown): Promise<{ success: boolean }> {
  if (!hasMake || !env.server.MAKE_WEBHOOK_URL) return { success: true };
  try {
    const res = await fetch(env.server.MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { success: res.ok };
  } catch {
    return { success: false };
  }
}
