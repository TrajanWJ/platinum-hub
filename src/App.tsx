import { Routes, Route, NavLink } from 'react-router-dom'
import { vendors, Vendor } from './data'

const NAV = [['/', 'Home'], ['/flippers', 'Flipper Outreach'], ['/plates', 'Plate Outreach']]

function Stars({ n }: { n: number }) {
  return <span className="fit">{'\u2605'.repeat(n)}<span className="d">{'\u2605'.repeat(5 - n)}</span></span>
}

function copy(text: string, el: HTMLButtonElement) {
  navigator.clipboard.writeText(text).then(() => { const o = el.textContent; el.textContent = 'Copied!'; setTimeout(() => el.textContent = o, 1200) })
}

function Card({ v }: { v: Vendor }) {
  const wa = v.whatsapp ? `https://wa.me/${v.whatsapp}?text=${encodeURIComponent(v.message)}` : null
  return (
    <article className="card">
      <header><h3>{v.name}</h3><div className="meta"><Stars n={v.fit} /><span className="chip">{v.region}</span>{v.moq ? <span className="chip">MOQ {v.moq}</span> : null}</div></header>
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

function List({ cat }: { cat: 'flipper' | 'plate' }) {
  const items = vendors.filter(v => v.category === cat).sort((a, b) => b.fit - a.fit)
  return <section className="grid">{items.map((v, i) => <Card key={i} v={v} />)}</section>
}

function Home() {
  const f = vendors.filter(v => v.category === 'flipper').length
  const p = vendors.filter(v => v.category === 'plate').length
  const wa = vendors.filter(v => v.whatsapp).length
  return (
    <div>
      <h1>Platinum Plates — Outreach Hub</h1>
      <p className="lede">Copy-ready partner messages. Tap Copy, then Open in WhatsApp / Alibaba. The list grows from the overnight scraper.</p>
      <div className="stats"><div className="stat"><b>{f}</b><span>flipper vendors</span></div><div className="stat"><b>{p}</b><span>plate vendors</span></div><div className="stat"><b>{wa}</b><span>WhatsApp-ready</span></div></div>
      <p className="muted">Use the tabs above. Phase 1 seed data — scraper + more page types (intl directory, email, walkthroughs, research) coming next.</p>
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
          <Route path="/flippers" element={<List cat="flipper" />} />
          <Route path="/plates" element={<List cat="plate" />} />
        </Routes>
      </main>
    </>
  )
}
