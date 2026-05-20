export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.status(200).end(); return }
  if (req.method !== 'POST') { res.status(405).json({error:'Method not allowed'}); return }
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) { res.status(500).json({error:'No API key'}); return }
  try {
    const b = req.body
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:600,system:b.system||'',messages:b.messages})
    })
    const d = await r.json()
    res.status(200).json(r.ok ? {content:d.content} : {error:JSON.stringify(d)})
  } catch(e) {
    res.status(200).json({error:e.message})
  }
}
