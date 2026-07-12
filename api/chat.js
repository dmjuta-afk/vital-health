// VITÁL AI proxy — hardened: origin allowlist, server-side caps, input validation
const ALLOWED_ORIGINS = [
  "https://myvital.app",
  "https://www.myvital.app",
];
const isAllowed = (origin) =>
  origin && (ALLOWED_ORIGINS.includes(origin) || /^https:\/\/vital-health-[a-z0-9-]+-vital-health-s-projects\.vercel\.app$/.test(origin));

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  // Only echo CORS headers for our own domains + Vercel previews (blocks browser abuse from other sites)
  if (isAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
  // Reject non-browser or foreign-origin calls outright
  if (!isAllowed(origin)) { res.status(403).json({ error: "Forbidden" }); return; }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { res.status(500).json({ error: "API key not configured" }); return; }

  try {
    const body = req.body || {};

    // ── Input validation (cost + abuse protection) ──
    if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 40) {
      res.status(400).json({ error: "Invalid messages" }); return;
    }
    let totalChars = 0;
    for (const m of body.messages) {
      if (!m || typeof m.content !== "string" || (m.role !== "user" && m.role !== "assistant")) {
        res.status(400).json({ error: "Invalid message format" }); return;
      }
      totalChars += m.content.length;
    }
    if (totalChars > 24000) { res.status(400).json({ error: "Conversation too long" }); return; }
    const system = typeof body.system === "string" ? body.system.slice(0, 6000) : "";
    // Server-side hard cap — client can request LESS, never more
    const maxTokens = Math.min(Math.max(parseInt(body.max_tokens, 10) || 600, 1), 800);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: maxTokens,
        system,
        messages: body.messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) { res.status(response.status).json({ error: "AI service error" }); return; }
    res.status(200).json({ content: data.content });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
