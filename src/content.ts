import leanPlan from './content/guide-lean-plan.md?raw'
import chinaOutreach from './content/guide-china-outreach.md?raw'
import plateDurability from './content/guide-plate-durability.md?raw'
import flipperQuality from './content/guide-flipper-quality.md?raw'
import assemblyQc from './content/guide-assembly-qc.md?raw'
import sourcingOverview from './content/research-sourcing-overview.md?raw'
import oemGuide from './content/research-oem-buyers-guide.md?raw'
import competitors from './content/research-competitors.md?raw'
import onlinePresence from './content/research-online-presence.md?raw'

export type Doc = { title: string; category: 'guide' | 'research'; body: string }
export const docs: Doc[] = [
  { title: 'Lean Plan — Start Here', category: 'guide', body: leanPlan },
  { title: 'China OEM Outreach Playbook', category: 'guide', body: chinaOutreach },
  { title: 'Plate Durability & Printing', category: 'guide', body: plateDurability },
  { title: 'Flipper Quality & Build', category: 'guide', body: flipperQuality },
  { title: 'Assembly & QC', category: 'guide', body: assemblyQc },
  { title: 'Sourcing Overview (3 paths)', category: 'research', body: sourcingOverview },
  { title: "OEM / ODM Buyer's Guide", category: 'research', body: oemGuide },
  { title: 'Competitors', category: 'research', body: competitors },
  { title: 'Our Online Presence', category: 'research', body: onlinePresence },
]
