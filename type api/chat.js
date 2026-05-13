/**
 * VITÁL — Secure AI Proxy
 * /api/chat.js — Vercel Serverless Function
 *
 * Anthropic API key NEVER leaves the server.
 * Client sends messages → this function adds the key → calls Anthropic.
 * Set ANTHROPIC_API_KEY in Vercel environment variables (never in code).
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security: CORS — only allow requests from your own domain
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'https://vitalhealth.app',
    'https://www.vitalhealth.app',
    'https://vital-health.vercel.app',
    'http://localhost:5173', // dev
    'http://localhost:3000', // dev
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { messages, system, max_tokens } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Rate limiting: basic check (Vercel adds more via dashboard)
    const messageCount = messages.length;
    if (messageCount > 50) {
      return res.status(400).json({ error: 'Too many messages in context' });
    }

    // API key lives only in server environment — NEVER in client code
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Call Anthropic API server-side
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: max_tokens || 600,
        system: system || '',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Anthropic API error:', response.status, error);
      return res.status(response.status).json({ 
        error: 'AI service temporarily unavailable. Please try again.' 
      });
    }

    const data = await response.json();

    // Return only what the client needs — no API metadata exposed
    return res.status(200).json({
      content: data.content,
      usage: {
        input_tokens: data.usage?.input_tokens,
        output_tokens: data.usage?.output_tokens,
      }
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Connection error. Please check your internet and try again.' 
    });
  }
}
