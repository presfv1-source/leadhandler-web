import type { Lead, Message } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LlmExtracted {
  intent?: string;       // e.g. "buying", "selling", "renting", "investing", "unknown"
  timeline?: string;     // e.g. "immediately", "1-3 months", "3-6 months", "6-12 months", "just looking"
  budget?: string;       // e.g. "$300k-$400k", "unknown"
  area?: string;         // e.g. "Heights, Houston" or "Spring, TX"
  preapproval?: string;  // "yes", "no", "unknown"
  beds?: string;         // e.g. "3"
  baths?: string;        // e.g. "2"
  price_range?: string;  // e.g. "$250k-$350k"
  notes?: string;        // any extra info the LLM captured
}

/** Alias for LlmExtracted (used by airtable-ext). */
export type QualificationExtraction = LlmExtracted;

export interface LlmResult {
  replyText: string;
  extracted: LlmExtracted;
  isQualified: boolean;
  summary: string;
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are an AI SMS assistant for a real estate brokerage. Your job is to:
1. Reply to the lead's latest message in a friendly, concise SMS (under 320 chars).
2. Extract any qualification details from the FULL conversation.
3. Decide if the lead is "qualified" (has provided intent + at least 2 of: timeline, budget/price range, area).

RULES:
- Keep replies short, warm, and professional. Use first names when available.
- Ask at most 1-2 follow-up questions per reply if info is missing.
- NEVER ask about race, religion, national origin, familial status, disability, sex, or any protected class.
- NEVER provide specific property valuations or legal/financial advice.
- If the lead says "stop", "unsubscribe", or similar, reply with a polite opt-out confirmation and set intent to "opt_out".

OUTPUT FORMAT — respond with ONLY valid JSON, no markdown fences:
{
  "replyText": "Your SMS reply here",
  "extracted": {
    "intent": "buying|selling|renting|investing|unknown|opt_out",
    "timeline": "string or null",
    "budget": "string or null",
    "area": "string or null",
    "preapproval": "yes|no|unknown",
    "beds": "string or null",
    "baths": "string or null",
    "price_range": "string or null",
    "notes": "string or null"
  },
  "isQualified": true/false,
  "summary": "1-2 sentence summary of lead status"
}`;

// ---------------------------------------------------------------------------
// Build conversation for the LLM
// ---------------------------------------------------------------------------

function buildUserPrompt(lead: Lead, messages: Message[]): string {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const history = sorted
    .map((m) => {
      const role = m.direction === "in" ? "LEAD" : "AGENT";
      return `[${role}] ${m.body}`;
    })
    .join("\n");

  return `LEAD PROFILE:
- Name: ${lead.name || "Unknown"}
- Phone: ${lead.phone}
- Source: ${lead.source || "Unknown"}
- Current status: ${lead.status}

CONVERSATION HISTORY (oldest first):
${history || "(no messages yet)"}

Respond with the JSON object only.`;
}

// ---------------------------------------------------------------------------
// Provider: OpenAI
// ---------------------------------------------------------------------------

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[llm] OpenAI error:", res.status, err);
    throw new Error(`OpenAI API error: ${res.status}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "";
}

// ---------------------------------------------------------------------------
// Provider: Anthropic
// ---------------------------------------------------------------------------

async function callAnthropic(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[llm] Anthropic error:", res.status, err);
    throw new Error(`Anthropic API error: ${res.status}`);
  }

  const data = (await res.json()) as {
    content: { type: string; text: string }[];
  };
  return data.content.find((c) => c.type === "text")?.text ?? "";
}

// ---------------------------------------------------------------------------
// Parse LLM output
// ---------------------------------------------------------------------------

function parseLlmOutput(raw: string): LlmResult {
  // Strip markdown code fences if the model wraps in ```json ... ```
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as LlmResult;

    // Validate minimum shape
    if (typeof parsed.replyText !== "string" || !parsed.replyText.trim()) {
      throw new Error("Missing replyText");
    }

    return {
      replyText: parsed.replyText.trim().slice(0, 1600), // SMS safety cap
      extracted: parsed.extracted ?? {},
      isQualified: Boolean(parsed.isQualified),
      summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
    };
  } catch (e) {
    console.error("[llm] Failed to parse LLM output:", e, "Raw:", raw.slice(0, 500));
    // Fallback: use the raw text as the reply, no extraction
    return {
      replyText: raw.slice(0, 320).trim() || "Thanks for reaching out! An agent will be with you shortly.",
      extracted: {},
      isQualified: false,
      summary: "",
    };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Pick which LLM provider to use based on env vars.
 * Priority: OPENAI_API_KEY > ANTHROPIC_API_KEY
 */
function getProvider(): "openai" | "anthropic" {
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  throw new Error("No LLM API key configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.");
}

/**
 * Generate an SMS reply and extract structured qualification data from the conversation.
 */
export async function generateReplyAndExtract({
  lead,
  messages,
}: {
  lead: Lead;
  messages: Message[];
}): Promise<LlmResult> {
  const userPrompt = buildUserPrompt(lead, messages);
  const provider = getProvider();

  let raw: string;
  if (provider === "anthropic") {
    raw = await callAnthropic(SYSTEM_PROMPT, userPrompt);
  } else {
    raw = await callOpenAI(SYSTEM_PROMPT, userPrompt);
  }

  return parseLlmOutput(raw);
}
