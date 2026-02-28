import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ROLES: Record<string, string> = {
  developer: "Developer",
  "project-manager": "Project Manager",
  qa: "QA",
  designer: "Designer",
  agent: "Agent",
  bot: "Bot",
  customer: "Customer",
  stakeholder: "Stakeholder",
  "finance-team": "Finance Team",
  legal: "Legal",
  support: "Support",
  marketing: "Marketing",
  executive: "Executive",
};

const LANG_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  it: "Italian",
  ja: "Japanese",
  zh: "Chinese (Mandarin)",
  uk: "Ukrainian",
  be: "Belarusian",
  hi: "Hindi",
  ru: "Russian",
  ar: "Arabic",
  ko: "Korean",
  tr: "Turkish",
  pl: "Polish",
  nl: "Dutch",
  vi: "Vietnamese",
  th: "Thai",
  id: "Indonesian",
};

function buildPrompt(params: {
  originalMessage: string;
  fromRole: string;
  toRole: string;
  fromLanguage?: string;
  toLanguage?: string;
  feedback?: string;
}): string {
  const fromRoleLabel = ROLES[params.fromRole] ?? params.fromRole;
  const toRoleLabel = ROLES[params.toRole] ?? params.toRole;
  const fromLangLabel = params.fromLanguage
    ? (LANG_NAMES[params.fromLanguage] ?? params.fromLanguage)
    : null;
  const toLangLabel = params.toLanguage
    ? (LANG_NAMES[params.toLanguage] ?? params.toLanguage)
    : null;

  let prompt = `YakYak rewrites should:
- Adjust tone and language based on the sender's and recipient's roles (e.g., PM to Developer, Developer to Client)
- Preserve the intent of the original message
- Clarify any ambiguous or overly technical language
- Keep the style appropriate for the target audience (e.g., informal for Slack, clear for clients, structured for Jira)
- Translate messages if sender and recipient languages are different
- Respect the tone of the message (friendly, urgent, frustrated, etc.)
- Automatically fix typos, vague expressions, and awkward phrasing
- Keep the rewritten message natural, short, and actionable

Original Message:
\`\`\`
${params.originalMessage}
\`\`\`
From Role: ${fromRoleLabel}
To Role: ${toRoleLabel}
`;
  if (fromLangLabel) prompt += `From Language: ${fromLangLabel}\n`;
  if (toLangLabel) prompt += `To Language: ${toLangLabel}\n`;
  if (params.feedback?.trim()) {
    prompt += `\nFeedback on previous rewrite: The previous rewrite was ${params.feedback.trim()}.\nTake this into account when rewriting the message.\n`;
  }
  prompt += `\nRewritten Message:\n`;
  return prompt;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY. Add it to .env and restart the server. See GEMINI_SETUP.md." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      message,
      fromRole = "developer",
      toRole = "project-manager",
      fromLang,
      toLang,
      feedback,
    } = body as {
      message?: string;
      fromRole?: string;
      toRole?: string;
      fromLang?: string;
      toLang?: string;
      feedback?: string;
    };

    const text = typeof message === "string" ? message.trim() : "";
    if (!text) {
      return NextResponse.json(
        { error: "Missing or empty message" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt({
      originalMessage: text,
      fromRole,
      toRole,
      fromLanguage: fromLang || undefined,
      toLanguage: toLang || undefined,
      feedback: typeof feedback === "string" ? feedback : undefined,
    });

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        maxOutputTokens: 2048,
      },
    });

    const translated = response.text?.trim() ?? "";
    if (!translated) {
      return NextResponse.json(
        { error: "Gemini returned no text" },
        { status: 502 }
      );
    }

    return NextResponse.json({ translated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Translation failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
