import { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { vendors, Vendor } from './data'

const NAV = [['/', 'Home'], ['/flippers', 'Flipper Outreach'], ['/plates', 'Plate Outreach']]
const REGIONS = ['All', 'USA', 'China', 'Intl']

function Stars({ n }: { n: number }) {
  return <span className="fit">{'★'.repeat(n)}<span className="d">{'★'.repeat(5 - n)}</span></span>
}

function copy(text: string, el: HTMLButtonElement) {
  navigator.clipboard.writeText(text).then(() => { const o = el.textContent; el.textContent = 'Copied!'; setTimeout(() => { el.textContent = o }, 1200) })
}

function Card({ v }: { v: Vendor }) {
  const wa = v.whatsapp ? `https://wa.me/${v.whatsapp}?text=${encodeURIComponent(v.message)}` : null
  return (
    <article className="card">
      <header><h3>{v.name}</h3><div className="meta"><Stars n={v.fit} /><span className="chip">{v.region}</span>{v.moq ? <span className="chip">MOQ {v.moq}</span> : null}{v.verified ? <span className="chip ok">verified</span> : null}</div></header>
      <div className="msg">{v.message}</div>
      <div className="actions">
        <button className="btn" onClick={e => copy(v.message, e.currentTarget)}>Copy message</button>
        {wa ? <a className="btn primary" href={wa} target="_blank" rel="noopener">Open in WhatsApp</a>
            : v.link ? <a className="btn primary" href={v.link} target="_blank" rel="noopener">Open {v.linkLabel || 'link'} ↗</a> : null}
      </div>
      {v.whatsapp ? <div className="num"><span>+{v.whatsapp}</span><button className="mini" onClick={e => copy('+' + v.whatsapp!, e.currentTarget)}>copy</button></div> : null}
    </article>
  )
}

function List({ cat, title }: { cat: 'flipper' | 'plate'; title: string }) {
  const [region, setRegion] = useState('All')
  const [q, setQ] = useState('')
  const base = vendors.filter(v => v.category === cat)
  const items = base
    .filter(v => region === 'All' || v.region === region)
    .filter(v => !q || v.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.fit - a.fit)
  return (
    <div>
      <h1>{title} <span className="count">{items.length}</span></h1>
      <div className="filters">
        {REGIONS.map(r => {
          const n = r === 'All' ? base.length : base.filter(v => v.region === r).length
          return <button key={r} className={region === r ? 'on' : ''} onClick={() => setRegion(r)}>{r} <b>{n}</b></button>
        })}
        <input className="search" placeholder="search name…" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <section className="grid">{items.map((v, i) => <Card key={i} v={v} />)}</section>
    </div>
  )
}

function Home() {
  const f = vendors.filter(v => v.category === 'flipper').length
  const p = vendors.filter(v => v.category === 'plate').length
  const wa = vendors.filter(v => v.whatsapp).length
  const usa = vendors.filter(v => v.region === 'USA').length
  const cn = vendors.filter(v => v.region === 'China').length
  return (
    <div>
      <h1>Platinum Plates — Outreach Hub</h1>
      <p className="lede">Copy-ready partner messages for every vendor we've found. Tap Copy, then Open in WhatsApp or the supplier site. Lists grow as the scraper finds more.</p>
      <div className="stats">
        <div className="stat"><b>{f}</b><span>flipper vendors</span></div>
        <div className="stat"><b>{p}</b><span>plate vendors</span></div>
        <div className="stat"><b>{usa}</b><span>USA-based</span></div>
        <div className="stat"><b>{cn}</b><span>China OEM</span></div>
        <div className="stat"><b>{wa}</b><span>WhatsApp-ready</span></div>
      </div>
      <p className="muted">Filter by region + search on each tab. More page types (email lists, walkthroughs, research, forms) coming as we build.</p>
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
          <Route path="/flippers" element={<List cat="flipper" title="Flipper Outreach" />} />
          <Route path="/plates" element={<List cat="plate" title="Plate Outreach" />} />
        </Routes>
      </main>
    </>
  )
}
