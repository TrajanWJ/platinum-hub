import { useState, useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { marked } from 'marked'
import { vendors, Vendor } from './data'
import { docs } from './content'
import { vkey, entryOf, setStatus, setDeleted, restoreAll, useVState } from './store'

// Plates first — product split is the top-level nav.
const NAV = [['/', 'Overview'], ['/plates', 'Plates'], ['/flippers', 'Flippers'], ['/other', 'Other'], ['/plans', 'Plans'], ['/analysis', 'Analysis']]
const REGIONS = ['All', 'DMV', 'USA', 'China', 'Intl']
const CHANNELS: [string, string][] = [['all', 'All'], ['wa', 'WhatsApp'], ['email', 'Email']]
const catLabel = (c: string) => c === 'flipper' ? 'Flipper' : c === 'plate' ? 'Plate' : 'Other'

function Stars({ n }: { n: number }) {
  return <span className="fit">{'★'.repeat(n)}<span className="d">{'★'.repeat(5 - n)}</span></span>
}
function copy(text: string, el: HTMLButtonElement) {
  navigator.clipboard.writeText(text).then(() => { const o = el.textContent; el.textContent = 'Copied!'; setTimeout(() => { el.textContent = o }, 1200) })
}
function siteLabel(url?: string) {
  if (!url) return 'site'
  if (url.includes('alibaba')) return 'Alibaba'
  if (url.includes('made-in-china')) return 'Made-in-China'
  if (url.includes('dhgate')) return 'DHgate'
  return 'site'
}

function Feedback({ id, label }: { id: string; label?: string }) {
  const [val, setVal] = useState(''); const [status, setStatusMsg] = useState('')
  useEffect(() => {
    let alive = true
    fetch('/api/feedback').then(r => r.json()).then(d => {
      if (alive && d.data && d.data[id] && d.data[id].value != null) setVal(d.data[id].value)
    }).catch(() => { const v = localStorage.getItem('fb:' + id); if (alive && v) setVal(v) })
    return () => { alive = false }
  }, [id])
  const save = () => {
    setStatusMsg('saving…'); localStorage.setItem('fb:' + id, val)
    fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: id, value: val }) })
      .then(r => setStatusMsg(r.ok ? 'saved for everyone ✓' : 'saved locally')).catch(() => setStatusMsg('saved locally'))
    setTimeout(() => setStatusMsg(''), 2500)
  }
  return (
    <div className="fb">
      <div className="fb-h"><span>{label || 'Notes & feedback'}</span><span className="fb-s">{status}</span></div>
      <textarea value={val} onChange={e => setVal(e.target.value)} onBlur={save} placeholder="Type notes or feedback — shared with everyone, saved permanently." />
      <button className="mini" onClick={save}>Save</button>
    </div>
  )
}

function VendorCtl({ v }: { v: Vendor }) {
  const k = vkey(v); const done = entryOf(k).status === 'contacted'
  return (
    <div className="ctl">
      <button className={'mini' + (done ? ' done' : '')} onClick={() => setStatus(k, done ? 'new' : 'contacted')}>{done ? '✓ contacted' : 'mark contacted'}</button>
      <button className="mini del" onClick={() => setDeleted(k, true)}>delete</button>
    </div>
  )
}

// Adaptive card: surfaces whatever channels exist (WhatsApp + email + site).
function VendorCard({ v }: { v: Vendor }) {
  const done = entryOf(vkey(v)).status === 'contacted'
  const wa = v.whatsapp ? `https://wa.me/${v.whatsapp}?text=${encodeURIComponent(v.message)}` : null
  const subj = v.emailSubject || 'Partnership inquiry — Platinum Plates'
  const ebody = v.emailBody || v.message
  const mailto = v.email ? `mailto:${v.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(ebody)}` : null
  return (
    <article className={'card' + (done ? ' done' : '')}>
      <header><h3>{v.name}</h3><div className="meta"><span className={'chip ' + v.category}>{catLabel(v.category)}</span><Stars n={v.fit} /><span className="chip">{v.region}</span>{v.moq ? <span className="chip">MOQ {v.moq}</span> : null}{v.whatsapp ? <span className="chip ok">WhatsApp</span> : null}{v.email ? <span className="chip ok">email</span> : null}{v.verified ? <span className="chip ok">verified</span> : null}</div></header>
      {v.email ? <div className="subj"><b>Subject:</b> {subj}</div> : null}
      <div className="msg">{v.message}</div>
      <div className="actions">
        <button className="btn" onClick={e => copy(v.message, e.currentTarget)}>Copy message</button>
        {wa ? <a className="btn primary" href={wa} target="_blank" rel="noopener">Open in WhatsApp</a> : null}
        {mailto ? <a className="btn primary" href={mailto}>Open email ✉</a> : null}
        {!wa && !mailto && v.link ? <a className="btn primary" href={v.link} target="_blank" rel="noopener">Open {siteLabel(v.link)} ↗</a> : null}
      </div>
      {v.whatsapp ? <div className="num"><span>+{v.whatsapp}</span><button className="mini" onClick={e => copy('+' + v.whatsapp!, e.currentTarget)}>copy</button></div> : null}
      {v.email ? <div className="num"><span>{v.email}</span><button className="mini" onClick={e => copy(v.email!, e.currentTarget)}>copy</button></div> : null}
      <VendorCtl v={v} />
    </article>
  )
}

function RegionBar({ base, region, setRegion, q, setQ }: any) {
  return (
    <div className="filters">
      {REGIONS.map(r => {
        const n = r === 'All' ? base.length : base.filter((v: Vendor) => v.region === r).length
        return <button key={r} className={region === r ? 'on' : ''} onClick={() => setRegion(r)}>{r} <b>{n}</b></button>
      })}
      <input className="search" placeholder="search name…" value={q} onChange={e => setQ(e.target.value)} />
    </div>
  )
}

function statusMatch(v: Vendor, stat: string) {
  if (stat === 'All') return true
  const done = entryOf(vkey(v)).status === 'contacted'
  return stat === 'contacted' ? done : !done
}
function StatusBar({ stat, setStat, items }: { stat: string; setStat: (s: string) => void; items: Vendor[] }) {
  const newN = items.filter(v => entryOf(vkey(v)).status !== 'contacted').length
  return (
    <div className="filters statusbar">
      {[['All', 'All'], ['new', 'New'], ['contacted', 'Contacted']].map(([val, lab]) => {
        const n = val === 'All' ? items.length : val === 'new' ? newN : items.length - newN
        return <button key={val} className={stat === val ? 'on' : ''} onClick={() => setStat(val)}>{lab} <b>{n}</b></button>
      })}
    </div>
  )
}
function DeletedNote() {
  const all = useVState()
  const n = Object.values(all).filter((e: any) => e.deleted).length
  if (!n) return null
  return <p className="muted deleted-note">{n} hidden/deleted · <button className="linkbtn" onClick={restoreAll}>restore all</button></p>
}

function ProductHub({ cat, title, lede }: { cat: 'flipper' | 'plate' | 'other'; title: string; lede: string }) {
  useVState()
  const [chan, setChan] = useState('all'); const [region, setRegion] = useState('All'); const [q, setQ] = useState(''); const [stat, setStat] = useState('All')
  const all = vendors.filter(v => v.category === cat && !entryOf(vkey(v)).deleted)
  const byChan = all.filter(v => chan === 'all' ? true : chan === 'wa' ? !!v.whatsapp : !!v.email)
  const pre = byChan.filter(v => region === 'All' || v.region === region).filter(v => !q || v.name.toLowerCase().includes(q.toLowerCase()))
  const items = pre.filter(v => statusMatch(v, stat)).sort((a, b) => b.fit - a.fit)
  return (
    <div>
      <h1>{title} <span className="count">{items.length}</span></h1>
      <p className="lede">{lede}</p>
      <div className="filters catbar">
        {CHANNELS.map(([val, lab]) => {
          const n = val === 'all' ? all.length : val === 'wa' ? all.filter(v => v.whatsapp).length : all.filter(v => v.email).length
          return <button key={val} className={chan === val ? 'on' : ''} onClick={() => setChan(val)}>{lab} <b>{n}</b></button>
        })}
      </div>
      <RegionBar base={byChan} region={region} setRegion={setRegion} q={q} setQ={setQ} />
      <StatusBar stat={stat} setStat={setStat} items={pre} />
      <DeletedNote />
      <section className="grid">{items.map((v, i) => <VendorCard key={i} v={v} />)}</section>
      <Feedback id={'notes:' + cat} label={`${title} — shared notes`} />
    </div>
  )
}

function Docs({ category, title }: { category: 'guide' | 'research'; title: string }) {
  const items = docs.filter(d => d.category === category)
  const [sel, setSel] = useState(0)
  const doc = items[sel]
  return (
    <div>
      <h1>{title}</h1>
      <div className="filters">{items.map((d, i) => <button key={i} className={sel === i ? 'on' : ''} onClick={() => setSel(i)}>{d.title}</button>)}</div>
      {doc ? <article className="doc" dangerouslySetInnerHTML={{ __html: marked.parse(doc.body) as string }} /> : <p className="muted">No documents.</p>}
      {doc ? <Feedback id={'doc:' + category + ':' + doc.title} label={'Feedback on "' + doc.title + '"'} /> : null}
    </div>
  )
}

function NavCard({ to, title, desc, n, tag }: { to: string; title: string; desc: string; n?: number; tag?: string }) {
  return <NavLink to={to} className="navcard"><div className="nc-h"><b>{title}</b>{tag ? <span className="count">{tag}</span> : n != null ? <span className="count">{n}</span> : null}</div><span className="nc-d">{desc}</span></NavLink>
}

function Home() {
  const f = vendors.filter(v => v.category === 'flipper').length
  const p = vendors.filter(v => v.category === 'plate').length
  const o = vendors.filter(v => v.category === 'other').length
  const pWa = vendors.filter(v => v.category === 'plate' && v.whatsapp).length
  const pEm = vendors.filter(v => v.category === 'plate' && v.email).length
  const wa = vendors.filter(v => v.whatsapp).length
  const em = vendors.filter(v => v.email).length
  const dmv = vendors.filter(v => v.region === 'DMV').length
  return (
    <div>
      <section className="hero">
        <h1>Platinum Plates — Operating Hub</h1>
        <p className="lede">Everything to get Platinum Plates off the ground, in one place. <b>Current focus: plate outreach.</b> Pick a product below — each has its own WhatsApp / Email channels, region & status filters, and shared notes.</p>
        <div className="stats">
          <div className="stat"><b>{vendors.length}</b><span>vendors</span></div>
          <div className="stat"><b>{wa}</b><span>WhatsApp-ready</span></div>
          <div className="stat"><b>{em}</b><span>Email-ready</span></div>
          <div className="stat"><b>{dmv}</b><span>DMV-local</span></div>
        </div>
      </section>

      <section>
        <h2>Product outreach</h2>
        <div className="cards2">
          <NavCard to="/plates" title="▸ Plates — start here" desc={`Plate printers & makers. ${pEm} email-ready, ${pWa} WhatsApp-ready. Channels + region + status inside.`} n={p} />
          <NavCard to="/flippers" title="Flippers" desc="Complete-unit OEMs & brands to rebrand — when you're ready for flipper outreach." n={f} />
          <NavCard to="/other" title="Other contacts" desc="Fulfillment, packaging, merch & local services to launch with." n={o} />
        </div>
      </section>

      <section>
        <h2>Knowledge</h2>
        <div className="cards2">
          <NavCard to="/plans" title="Plans & playbooks" desc="Lean plan, China OEM outreach, plate durability, flipper quality, assembly." />
          <NavCard to="/analysis" title="Analysis" desc="Sourcing overview, OEM/ODM buyer's guide, competitors, online presence." />
        </div>
      </section>

      <section>
        <h2>Executive summary</h2>
        <div className="doc summary-doc">
          <p><b>Focus now:</b> plate outreach first — durable custom plates via POD/dropship, local DMV printers, and wholesale makers. Flippers are queued for the next push.</p>
          <p><b>Model:</b> buy-and-brand, easy fulfilment — source finished product, add branding, sell to our DC car-scene audience. No in-house manufacturing.</p>
          <p><b>Now:</b> {p} plate vendors ({pEm} email-ready, {pWa} WhatsApp-ready), {dmv} DMV-local partners, {o} fulfillment/merch contacts. Work the Plates tab by channel + region; mark contacted as you go.</p>
          <p className="muted">Compliance (flippers, later): show/off-road/export only; don't ship to states banning sale (DE/TN/FL); FCC-ID remotes.</p>
        </div>
      </section>

      <Feedback id="home:notes" label="Team notes & feedback (shared, permanent)" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <header className="top"><div className="wrap"><span className="brand">Platinum Plates</span><nav>{NAV.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'on' : ''}>{label}</NavLink>)}</nav></div></header>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plates" element={<ProductHub cat="plate" title="Plate Outreach" lede="Plate printers & makers — durable custom plates. Pick a channel (WhatsApp / Email), filter by region (incl. DMV-local) and status. Current focus." />} />
          <Route path="/flippers" element={<ProductHub cat="flipper" title="Flipper Outreach" lede="Complete-unit flipper OEMs & brands to rebrand. Pick a channel, filter by region & status." />} />
          <Route path="/other" element={<ProductHub cat="other" title="Other Contacts" lede="Fulfillment, packaging, merch & local services that could help launch Platinum Plates." />} />
          <Route path="/plans" element={<Docs category="guide" title="Plans & Playbooks" />} />
          <Route path="/analysis" element={<Docs category="research" title="Analysis" />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  )
}
