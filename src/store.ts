import { useSyncExternalStore } from 'react'

// Per-vendor working state (contacted / deleted), persisted in the browser. No backend.
type Entry = { status?: 'new' | 'contacted'; deleted?: boolean }
const KEY = 'pp_vstate_v1'
let state: Record<string, Entry> = (() => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
})()
const subs = new Set<() => void>()
function emit() {
  localStorage.setItem(KEY, JSON.stringify(state))
  state = { ...state } // new ref so useSyncExternalStore re-renders
  subs.forEach(f => f())
}

export function vkey(v: { category: string; name: string }) { return v.category + ':' + v.name }
export function entryOf(k: string): Entry { return state[k] || {} }
export function setStatus(k: string, s: 'new' | 'contacted') { state[k] = { ...state[k], status: s }; emit() }
export function setDeleted(k: string, d: boolean) { state[k] = { ...state[k], deleted: d }; emit() }
export function restoreAll() { for (const k in state) if (state[k].deleted) state[k].deleted = false; emit() }

export function useVState() {
  return useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => state)
}
