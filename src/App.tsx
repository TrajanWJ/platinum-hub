import { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { marked } from 'marked'
import { vendors, Vendor } from './data'
import { docs } from './content'
import { vkey, entryOf, setStatus, setDeleted, restoreAll, useVState } from './store'

const NAV = [['/', 'Home'], ['/whatsapp', 'WhatsApp'], ['/email', 'Email'], ['/flippers', 'Flippers'], ['/plates', 'Plates'], ['/other', 'Other'], ['/guides', 'Guides'], ['/research', 'Research']]
const REGIONS = ['All', 'DMV', 'USA', 'China', 'Intl']
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

function VendorCtl({ v }: { v: Vendor }) {
  const k = vkey(v); const done = entryOf(k).status === 'contacted'
  return (
    <div className="ctl">
      <button className={'mini' + (done ? ' done' : '')} onClick={() => setStatus(k, done ? 'new' : 'contacted')}>{done ? '✓ contacted' : 'mark contacted'}</button>
      <button className="mini del" onClick={() => setDeleted(k, true)}>delete</button>
    </div>
  )
}

function Card({ v }: { v: Vendor }) {
  const done = entryOf(vkey(v)).status === 'contacted'
  const wa = v.whatsapp ? `https://wa.me/${v.whatsapp}?text=${encodeURIComponent(v.message)}` : null
  return (
    <article className={'card' + (done ? ' done' : '')}>
      <header><h3>{v.name}</h3><div className="meta"><span className={'chip ' + v.category}>{catLabel(v.category)}</span><Stars n={v.fit} /><span className="chip">{v.region}</span>{v.moq ? <span className="chip">MOQ {v.moq}</span> : null}{v.email ? <span className="chip ok">email</span> : null}{v.verified ? <span className="chip ok">verified</span> : null}</div></header>
      <div className="msg">{v.message}</div>
      <div className="actions">
        <button className="btn" onClick={e => copy(v.message, e.currentTarget)}>Copy message</button>
        {wa ? <a className="btn primary" href={wa} target="_blank" rel="noopener">Open in WhatsApp</a>
            : v.link ? <a className="btn primary" href={v.link} target="_blank" rel="noopener">Open {siteLabel(v.link)} ↗</a> : null}
      </div>
      {v.whatsapp ? <div className="num"><span>+{v.whatsapp}</span><button className="mini" onClick={e => copy('+' + v.whatsapp!, e.currentTarget)}>copy</button></div> : null}
      <VendorCtl v={v} />
    </article>
  )
}

function EmailCard({ v }: { v: Vendor }) {
  const subj = v.emailSubject || 'Partnership inquiry — Platinum Plates'
  const body = v.emailBody || v.message
  const mailto = `mailto:${v.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`
  const done = entryOf(vkey(v)).status === 'contacted'
  return (
    <article className={'card' + (done ? ' done' : '')}>
      <header><h3>{v.name}</h3><div className="meta"><span className={'chip ' + v.category}>{catLabel(v.category)}</span><Stars n={v.fit} /><span className="chip">{v.region}</span>{v.verified ? <span className="chip ok">verified</span> : null}</div></header>
      <div className="subj"><b>Subject:</b> {subj}</div>
      <div className="msg">{body}</div>
      <div className="actions">
        <button className="btn" onClick={e => copy(body, e.currentTarget)}>Copy email</button>
        <a className="btn primary" href={mailto}>Open email ✉</a>
      </div>
      <div className="num"><span>{v.email}</span><button className="mini" onClick={e => copy(v.email!, e.currentTarget)}>copy</button></div>
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

function statusMatch(v: Vendor, stat: string) {
  if (stat === 'All') return true
  const done = entryOf(vkey(v)).status === 'contacted'
  return stat === 'contacted' ? done : !done
}

function List({ cat, title }: { cat: 'flipper' | 'plate' | 'other'; title: string }) {
  useVState()
  const [region, setRegion] = useState('All'); const [q, setQ] = useState(''); const [stat, setStat] = useState('All')
  const base = vendors.filter(v => v.category === cat && !entryOf(vkey(v)).deleted)
  const pre = base.filter(v => region === 'All' || v.region === region).filter(v => !q || v.name.toLowerCase().includes(q.toLowerCase()))
  const items = pre.filter(v => statusMatch(v, stat)).sort((a, b) => b.fit - a.fit)
  return (
    <div>
      <h1>{title} <span className="count">{items.length}</span></h1>
      <RegionBar base={base} region={region} setRegion={setRegion} q={q} setQ={setQ} />
      <StatusBar stat={stat} setStat={setStat} items={pre} />
      <DeletedNote />
      <section className="grid">{items.map((v, i) => <Card key={i} v={v} />)}</section>
    </div>
  )
}

const CATS: [string, string][] = [['All', 'All'], ['flipper', 'Flippers'], ['plate', 'Plates'], ['other', 'Other']]

function ChannelList({ kind }: { kind: 'whatsapp' | 'email' }) {
  useVState()
  const [region, setRegion] = useState('All'); const [q, setQ] = useState(''); const [cat, setCat] = useState('All'); const [stat, setStat] = useState('All')
  const base = vendors.filter(v => (kind === 'whatsapp' ? v.whatsapp : v.email) && !entryOf(vkey(v)).deleted)
  const byCat = base.filter(v => cat === 'All' || v.category === cat)
  const pre = byCat.filter(v => region === 'All' || v.region === region).filter(v => !q || v.name.toLowerCase().includes(q.toLowerCase()))
  const items = pre.filter(v => statusMatch(v, stat)).sort((a, b) => b.fit - a.fit)
  const title = kind === 'whatsapp' ? 'WhatsApp-Ready' : 'Email-Ready'
  const lede = kind === 'whatsapp'
    ? 'Vendors with a real WhatsApp number + a customized message. Pick Flippers or Plates, then Copy → Open in WhatsApp (pre-filled).'
    : 'Vendors with a real email + a customized outreach email. Pick Flippers or Plates, then Copy → Open email (pre-filled).'
  return (
    <div>
      <h1>{title} <span className="count">{items.length}</span></h1>
      <p className="lede">{lede}</p>
      <div className="filters catbar">
        {CATS.map(([val, lab]) => {
          const n = val === 'All' ? base.length : base.filter(v => v.category === val).length
          return <button key={val} className={cat === val ? 'on' : ''} onClick={() => setCat(val)}>{lab} <b>{n}</b></button>
        })}
      </div>
      <RegionBar base={byCat} region={region} setRegion={setRegion} q={q} setQ={setQ} />
      <StatusBar stat={stat} setStat={setStat} items={pre} />
      <DeletedNote />
      <section className="grid">{items.map((v, i) => kind === 'whatsapp' ? <Card key={i} v={v} /> : <EmailCard key={i} v={v} />)}</section>
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
    </div>
  )
}

function Home() {
  const f = vendors.filter(v => v.category === 'flipper').length
  const p = vendors.filter(v => v.category === 'plate').length
  const wa = vendors.filter(v => v.whatsapp).length
  const em = vendors.filter(v => v.email).length
  const usa = vendors.filter(v => v.region === 'USA').length
  const cn = vendors.filter(v => v.region === 'China').length
  return (
    <div>
      <h1>Platinum Plates — Outreach Hub</h1>
      <p className="lede">Copy-ready partner outreach for every vendor we've found — WhatsApp & email, each with a customized message. Plus sourcing guides and research. Lists grow as the scraper finds more.</p>
      <div className="stats">
        <div className="stat"><b>{f}</b><span>flipper vendors</span></div>
        <div className="stat"><b>{p}</b><span>plate vendors</span></div>
        <div className="stat"><b>{wa}</b><span>WhatsApp-ready</span></div>
        <div className="stat"><b>{em}</b><span>Email-ready</span></div>
        <div className="stat"><b>{usa}</b><span>USA-based</span></div>
        <div className="stat"><b>{cn}</b><span>China OEM</span></div>
      </div>
      <p className="muted">Tabs: WhatsApp & Email = ready-to-send outreach · Flippers/Plates = full directories · Guides = sourcing playbooks · Research = market + vendor analysis.</p>
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
          <Route path="/whatsapp" element={<ChannelList kind="whatsapp" />} />
          <Route path="/email" element={<ChannelList kind="email" />} />
          <Route path="/flippers" element={<List cat="flipper" title="Flipper Outreach" />} />
          <Route path="/plates" element={<List cat="plate" title="Plate Outreach" />} />
          <Route path="/other" element={<List cat="other" title="Other Contacts" />} />
          <Route path="/guides" element={<Docs category="guide" title="Sourcing Guides" />} />
          <Route path="/research" element={<Docs category="research" title="Research" />} />
        </Routes>
      </main>
    </>
  )
}
