# Platinum Plates — Plate-Flipper Assembly & QC Guide

**Audience:** a 2-person DC/DMV shop finishing and/or assembling custom-branded motorized license-plate flippers for US plates (6"×12", single & double).

**Legal framing (read first):** Motorized/obscuring plate flippers are illegal to use on public roads in essentially every US state, and remote plate-obscuring devices draw extra scrutiny under federal and state law. Everything below assumes the product is sold and labeled as **show / off-road / private-property / film-prop / export-only**. Do not market road use. Keep a signed "intended use" acknowledgment on file for each sale. This guide is engineering/QC only and is not legal advice. [unverified — confirm with counsel for your specific states; rules vary by state]

---

## 0. The two paths (and the honest tradeoff)

| | **Path A — Finish a whole OEM unit** | **Path B — Assemble from frame + motor + remote** |
|---|---|---|
| What you buy | Complete flipper (frame + motor + control box + remote) from one factory | Metal frame, motor/actuator module, control box + remote, fasteners as separate SKUs |
| Your value-add | Branding, QC, sealing upgrades, repackaging, US support | All of Path A **plus** component selection, wiring, mechanism tuning |
| Time/unit | ~20–35 min (mostly QC + branding) | ~60–110 min (first units slower) |
| Reliability control | Limited — you inherit the factory's mechanism | High — you pick the self-locking gearbox, the IP67 motor, the remote |
| MOQ reality | Lower MOQ on finished units is easier to find for resellers | Component MOQs can be higher; motors/remotes often sold in bulk |
| Best when | You're validating demand, want fast turnaround | You've found a weak point in OEM units, or want a defensible "engineered" SKU |

**Recommendation for a 2-person shop:** start with **Path A** to learn the failure modes on real units, then selectively move to **Path B** only for the parts that actually fail in your QC (usually the motor seal, the hold-position mechanism, and the fasteners). Don't assemble from scratch on day one — it's a lot of labor for marginal gain until you know what breaks.

---

## 1. Bill of Materials (BOM)

### 1A. Core unit
| Item | Spec to insist on | Notes |
|---|---|---|
| Flipper frame | **Aluminum (6061/6063) or stainless**, not ABS | ABS frames crack at the pivot and sag. Metal is the whole pitch. |
| Motor / gear actuator | **IP67**, worm-gear or self-locking gearbox, 12 V DC | Worm gearing self-holds — gravity can't back-drive it (no droop with power off). |
| Control box / receiver | Rolling-code (KeeLoq-style), 12 V | Fixed-code is cloneable; rolling-code is the upgrade. |
| Remote(s) | **FCC-compliant**, rolling-code, 2+ per unit | Label FCC ID; keep a copy. Don't sell unmarked transmitters. [unverified — verify each remote's FCC grant] |
| Wiring harness / pigtail | Pre-tinned, fused (≥3–5 A inline fuse) | Add the fuse if the OEM omits it. |

### 1B. Reliability add-ons (your differentiator)
| Item | Use |
|---|---|
| Dielectric grease | Connectors, remote battery contacts, switch pins |
| Marine/silicone gear grease | Pivot bushings, worm gear (if serviceable) |
| RTV silicone (neutral-cure) | Sealing control-box seams, cable entry glands |
| Stainless A2/A4 fasteners (M4/M5) | Replace OEM zinc screws at pivot & mounting |
| Medium-strength threadlocker (blue, removable) | All structural fasteners. **Blue, not red** — red is permanent. |
| Nylon-insert lock nuts (nyloc) | Pivot points subject to vibration |
| Heat-shrink + adhesive-lined tubing | Any splice you make |
| Self-fusing silicone tape | Cable entry strain relief |
| Cable glands / grommets | Where harness exits the frame |
| Foam/rubber gasket strip | Control-box lid, plate-to-frame contact (anti-rattle) |

### 1C. Branding
| Item | Use |
|---|---|
| Laser-etch service or in-house fiber laser | Logo on aluminum frame (premium look) |
| Anodized/printed metal badge or domed decal | If you can't etch; adhesive-backed |
| 3M VHB / industrial adhesive | Badge mounting |
| Custom box + insert + spec/warning card | Repackaging; include the off-road/show-use notice |

### 1D. Consumables / packaging
Isopropyl alcohol (surface prep), microfiber cloths, anti-static bags, foam inserts, warranty/QC card, serial-number labels.

---

## 2. Tools needed

**Hand tools:** precision screwdriver set (PH/flat/Torx), metric hex/Allen set, small socket/nut driver set, needle-nose pliers, side cutters, wire strippers, deburring tool, small files, feeler gauge, torque screwdriver (0.5–5 N·m range — keeps you from stripping aluminum threads).

**Electrical/test:** multimeter (continuity + DC volts), benchtop 12 V DC power supply (current-limited, with amp readout — current draw is a key QC signal), inline fuse holders, crimper, heat-shrink gun / hot-air, soldering iron (Path B).

**Sealing/branding:** caulk applicator for RTV, grease syringes, fiber laser or outsourced etch, label printer.

**QC rig:** spray bottle + (optional) IP-rated spray nozzle for water test, stopwatch/phone, tape measure (remote range), cycle counter (manual tally or a cheap Arduino/relay loop if you get fancy — not required), a flat reference surface, and the assembly jig (Section 8).

---

## 3. Path A — Finish & QC a whole OEM unit (step-by-step)

1. **Receive & log.** Open carton, photograph as-received, record factory lot/batch. Assign your serial number.
2. **Visual inspection.** Check frame for casting flash, cracks at the pivot, paint/anodize defects, straight plate slots. Reject ABS-feeling frames if you ordered metal.
3. **Dry-fit a plate.** Insert a real 6"×12" plate (and double, if applicable). Confirm it seats flat, no rattle, retention tabs hold. Note gap with foam/gasket if it rattles.
4. **Bench power-up (no plate first).** Connect to current-limited 12 V supply. Watch idle and running current. A motor that pulls high or stalls is a reject. Record running amps as a baseline.
5. **Function test, unloaded.** Cycle flip up/down 5× via remote. Motion should be smooth, no grinding, full travel, clean stop at both ends.
6. **Hold-position check (the big one).** Power **off** at each end position; the plate must hold — no droop, no slow sag. Then power off mid-travel and confirm it stays. Self-locking worm gear should pass; if it sags, the unit is defective for your spec.
7. **Disassemble control box** (if accessible). Inspect solder joints, connector seating, presence of an inline fuse. Add a 3–5 A inline fuse if missing.
8. **Reliability pass:**
   - Dielectric grease on every connector and the remote battery contacts.
   - RTV-seal control-box seams and the cable-entry point; add a gland/grommet if the cable exits bare.
   - Replace any zinc pivot/mount fasteners with stainless; apply **blue** threadlocker; use nyloc where there's vibration.
   - Add gasket/foam to kill rattle.
9. **Branding.** Surface-prep the frame face (IPA). Laser-etch the logo, **or** apply the metal badge/decal with VHB. Keep logo clear of moving/sealing surfaces.
10. **Full QC test protocol** (Section 6). Do not skip — 100% of units.
11. **Repackage.** Anti-static bag, foam, remotes (batteries installed + a spare set taped separately so they don't drain in transit), QC card with serial, warning/intended-use card, branded box.
12. **Final record.** File QC sheet (pass/fail per test, baseline amps, serial). This is your warranty and return defense.

**Time/unit (Path A):** ~20–35 min once the bench flow is set. First few will be 45+ min.

---

## 4. Path B — Assemble from frame + motor + remote (step-by-step)

Do everything in Path A's *finish* steps too; this section is the build that comes before.

1. **Inspect components separately.** Frame (deburr cast edges, tap/chase threads if rough), motor/gearbox (confirm IP67 marking, confirm worm/self-locking type, bench-spin it), control box + remote (pair them, confirm rolling-code, confirm FCC marking).
2. **Bench-pair & program** the remote(s) to the receiver per the module's procedure. Pair at least 2 remotes. Record the procedure for support.
3. **Deburr & dry-fit** the motor into the frame's motor pocket. Confirm the output shaft/coupling aligns with the pivot with no bind.
4. **Mount the motor** with stainless fasteners + blue threadlocker. Torque to spec (don't overdrive aluminum — use the torque screwdriver). Nyloc on any through-bolt.
5. **Couple the pivot.** Grease the pivot bushings and worm gear with marine grease. Set end-stop alignment so full travel lands cleanly at both positions without slamming.
6. **Wire it.** Motor → control box → harness. Crimp + adhesive heat-shrink every joint; **no bare twists**. Install the inline fuse (3–5 A). Route the harness through a gland/grommet; strain-relieve with silicone tape.
7. **Seal.** RTV the control-box lid seam and cable entry. Dielectric grease all connectors before final mating.
8. **First power-up unloaded** on current-limited supply. Verify direction, travel, current draw, and the hold-position behavior (Section 6, Test 4). Re-tune end-stops if travel is short/long.
9. **Loaded test** with a real plate; recheck travel, current, hold.
10. **Branding → Full QC (Section 6) → Repackage** exactly as Path A.

**Time/unit (Path B):** ~60–110 min. Pairing, sealing, and end-stop tuning are the time sinks. Batch the pairing and sealing steps across multiple units to save time.

---

## 5. Reliability add-ons — why each one

- **Self-locking (worm-gear) mechanism:** the single most important reliability feature. It prevents back-drive, so the plate holds with power off — no droop. Spur-gear-only units sag; reject them.
- **IP67 motor + RTV sealing:** flippers live behind the bumper in road spray. Water in the motor or control box is the #1 field failure. Seal even on "IP67" units, because the *control box and cable entry* are often the weak point, not the motor.
- **Dielectric grease:** stops corrosion at connectors and battery contacts — the #2 field failure (intermittent operation).
- **Stainless + blue threadlocker + nyloc:** vibration walks fasteners loose over thousands of cycles. Stainless resists corrosion; blue threadlocker is *removable* for service (red is not — never use red here).
- **Inline fuse:** a stalled motor or short can cook the harness; the fuse protects the unit and the customer's wiring.
- **Gasket/foam:** kills rattle (a top complaint) and adds a moisture barrier at the plate interface.

General references for these practices: dielectric grease & corrosion at connectors — common automotive/marine electrical practice (e.g., https://en.wikipedia.org/wiki/Dielectric_grease); threadlocker grade guidance — Loctite/Henkel product docs (https://www.henkel-adhesives.com); worm-gear self-locking/back-drive behavior — standard gearing references (https://en.wikipedia.org/wiki/Worm_drive); IP67 ingress rating definition — IEC 60529 (https://en.wikipedia.org/wiki/IP_code). [verify specific product datasheets against these general principles]

---

## 6. 100% QC TEST PROTOCOL (every unit, no sampling)

Run in order. Any fail = pull the unit, log the failure mode, repair or scrap. Record results on the per-unit QC sheet.

**Test 1 — Cycle endurance (function & smoothness).**
Cycle flip up→down **20 complete cycles** via remote with a plate loaded. Watch for: smooth motion, full travel both ends, clean stop, no grinding/clicking, no rising current draw. *Pass:* 20/20 clean cycles. (Optionally run a 100-cycle burn-in on a sample batch to characterize the OEM lot — not on every unit.)

**Test 2 — Current draw.**
On the current-limited 12 V supply, record idle and running amps, loaded. *Pass:* within your established baseline (set from the first good units). A unit pulling noticeably high indicates bind/poor gearing → reject.

**Test 3 — Remote range & reliability.**
With the receiver powered, walk the remote out and confirm reliable trigger at **≥10 m / ~30 ft** line-of-sight, both up and down commands, 5 presses each. Confirm the **second** paired remote also works. *Pass:* reliable actuation at target range for all paired remotes. [range target is a shop standard — set yours to what the receiver actually achieves; document it]

**Test 4 — Hold-position with power OFF (critical).**
Drive to top position, **cut power**, wait **60 s** — plate must not droop (measure with feeler/ruler; >2 mm movement = fail). Repeat at bottom and at a mid-travel stop. *Pass:* no perceptible sag at any position. This is the test that proves the self-locking claim.

**Test 5 — Water spray / ingress.**
With unit powered and sealed, spray water across the motor housing, cable entry, and control box for **~30–60 s** from ~30 cm (a spray bottle is the minimum; an IP-rated spray nozzle is better and closer to IPX-rated test conditions). Then cycle 3× during/after. Let sit, re-cycle after 10 min. *Pass:* normal operation, no current spike, no water visible inside control box on inspection. (Full IP67 immersion testing is not required for finishing — this is a workmanship/seal-integrity check of *your* sealing, not a lab certification.) [the spray check verifies your sealing, not a certified IP rating]

**Test 6 — Fastener & mechanical audit.**
Verify all structural fasteners are stainless + threadlocked + torqued; tug-test the motor mount and pivot; confirm no rattle with plate inserted. *Pass:* nothing loose, no rattle.

**Test 7 — Final cosmetic & branding.**
Logo clean and straight, no overspray on moving parts, frame unmarred, plate seats flush. *Pass:* presentation-grade.

**Sign-off:** initials + date + serial on the QC sheet. Keep on file.

---

## 7. Realistic time per unit (2-person shop)

| Phase | Path A | Path B |
|---|---|---|
| Receive/log/inspect | 3–5 min | 8–12 min (per-component) |
| Build (mount/wire/couple) | n/a | 25–45 min |
| Reliability pass (grease/seal/fasteners) | 6–10 min | 10–15 min |
| Branding | 3–6 min (etch faster than badge cure) | 3–6 min |
| Full QC (Tests 1–7) | 8–12 min | 10–15 min |
| Repackage + records | 3–5 min | 3–5 min |
| **Total/unit** | **~20–35 min** | **~60–110 min** |

Two people in parallel (one building/sealing, one on QC/branding/packaging) realistically yields **~15–25 Path-A units/day** or **~6–10 Path-B units/day** once dialed in. First-week throughput is roughly half that. [shop estimate — calibrate against your actual first batch]

---

## 8. Simple jig idea

**Goal:** repeatable mounting, sealing, and testing without re-fixturing each unit.

Build a **plywood/MDF cradle base** (or aluminum extrusion / 2020 frame) with:
- **Two locating pins + a back stop** sized to the frame's outer edge so every unit sits in the exact same position (deburr/branding/sealing land consistently).
- A **toggle clamp** (cheap drill-press hold-down clamps) to lock the frame while you torque fasteners and apply RTV — frees both hands.
- A **fixed dummy plate** (or real plate) slot on the cradle for dry-fit and the cycle test, so loading is one motion.
- A **mounted 12 V binding-post / fused lead** at the side of the jig so you plug the harness into the same test point every time (no clip-fumbling). Add a panel ammeter so current draw is always visible.
- For **branding:** a registration corner on the jig so the laser/badge lands in the same spot every unit. If etching, a simple acrylic template that drops over the locating pins.
- For the **hold-position test:** a fixed ruler/feeler reference bracket at the top-position so you can eyeball droop against a line instead of measuring freehand.

Keep it dead simple: one cradle, one clamp, one fused test lead, one registration corner. That covers fixturing, electrical test, and branding alignment in a single station. Total cost is hardware-store-level. Don't over-build it before you've finished your first 20 units and know where the time actually goes.

---

## 9. Quick decision notes (balanced)

- **Cheapest viable:** Path A on a mid-tier metal OEM unit + your sealing/branding pass. Lowest labor, decent margin, fastest to market.
- **Premium SKU:** Path B with a hand-picked IP67 worm-gear motor and rolling-code FCC remote, fully sealed, stainless throughout, laser-etched. Charge for the engineering; back it with the QC sheet.
- **Don't:** ship ABS frames as "metal," use red threadlocker, sell unmarked remotes, or skip the hold-position and water tests — those are exactly the things that generate returns and the complaints that kill a small social-first brand.

*All product specs above are targets to verify against each supplier's actual datasheet. No suppliers, URLs, or contacts are invented here; the cited URLs are general engineering references, not product endorsements.*
