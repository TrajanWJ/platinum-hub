// Shared, persistent feedback store — backed by a JSON file in the GitHub repo (durable in git).
// No auth: everyone is one shared actor (intentional). GET returns all; POST merges {key,value}.
const REPO = process.env.GH_REPO || 'TrajanWJ/platinum-hub'
const TOKEN = process.env.GH_TOKEN
const FILE = 'data/feedback.json'
const URL = `https://api.github.com/repos/${REPO}/contents/${FILE}`
const H = { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'platinum-hub' }

async function read() {
  const r = await fetch(URL, { headers: H })
  if (r.status === 404) return { data: {}, sha: undefined }
  if (!r.ok) throw new Error('read ' + r.status)
  const j: any = await r.json()
  const content = Buffer.from(j.content, 'base64').toString('utf8') || '{}'
  return { data: JSON.parse(content), sha: j.sha as string }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store')
  if (!TOKEN) return res.status(200).json({ data: {}, _warn: 'no GH_TOKEN env' })
  try {
    if (req.method === 'GET') {
      const { data } = await read()
      return res.status(200).json({ data })
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      if (!body || !body.key) return res.status(400).json({ error: 'key required' })
      for (let attempt = 0; attempt < 2; attempt++) {
        const { data, sha } = await read()
        data[body.key] = { value: String(body.value ?? ''), ts: new Date().toISOString() }
        const put = await fetch(URL, {
          method: 'PUT', headers: H,
          body: JSON.stringify({ message: `feedback: ${body.key}`, content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'), sha }),
        })
        if (put.ok) return res.status(200).json({ ok: true })
        if (put.status !== 409) return res.status(500).json({ error: await put.text() })
        // 409 conflict — retry once with fresh sha
      }
      return res.status(409).json({ error: 'conflict' })
    }
    return res.status(405).end()
  } catch (e: any) {
    return res.status(500).json({ error: String(e) })
  }
}
