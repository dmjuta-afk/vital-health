export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'POST') return res.status(405).end()
  const key = process.env.ANTHROPIC_API_KEY
  const b = req.body
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},
    body: JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:600,system:b.system||'',messages:b.messages})
  })
  const d = await r.json()
  res.status(r.status).json(r.ok ? {content:d.content} : {error:'AI error'})
}
