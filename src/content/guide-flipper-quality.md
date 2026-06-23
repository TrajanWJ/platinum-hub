# Plate Flipper — Feasibility / Scale / Quality Strategy

Last updated: 2026-06-19. For a ~2-person business with on-call contractors, freelancers, partners (incl. CAD experts).
Pairs with [`sourcing-plate-flippers.md`](./sourcing-plate-flippers.md) (BOM + suppliers).

## The core decision: be a designer-assembler-brand, NOT a factory
A 2-person shop cannot run metal fabrication. The winning shape: **own the design IP + final
assembly + QC + branding + fulfillment; outsource all fabrication.** Your moat is a proprietary,
well-sealed, reliably-tested unit with a warranty — everything cheap units skip. Contractors handle
fab; CAD partners handle design + tooling; you control the spec, the test, and the brand.

## Crawl → Walk → Run (don't skip stages — each de-risks the next)

### Stage 0 — Rebrand & upgrade (now; weeks; ~low capital)
Buy OEM frames + upgrade the internals. Goal: cash flow + learn assembly + validate demand before spending on design.
- Source custom-logo frames (Shanghai Fa Yu does sticker-logo; Hangzhou Qianxi custom) OR whole units to teardown.
- Swap in the quality internals: **self-locking 12V worm gearmotor**, IP65–67 sealing, **rolling-code FCC-ID fob** (Solidremote), stainless/nyloc hardware, fused pre-loomed harness, **fail-safe return-to-visible**.
- Assemble in batches, time it, 100% function-test, ship.
- Exit criteria to move on: steady orders + a repeatable <15-min assembly + a clear list of what annoys you about the OEM frame.

### Stage 1 — CAD-led proprietary frame (1–3 mo; design + prototype spend)
Now your CAD experts earn their keep. Design YOUR frame around the proven internals from Stage 0.
- Design goals: metal frame, sealed motor pocket, universal/multi-vehicle mounting bracket, clean cable exit, integrated branding (etch boss), tool-light assembly (snap/bolt-in motor mount).
- Prototype cheap → real: 3D print (resin/FDM) for fit & ergonomics → **SendCutSend / Xometry / Protolabs** for real CNC/sheet-metal aluminum parts. No tooling cost at this stage.
- Test rig: bench flip-cycle endurance (e.g. 5–10k cycles), water-spray/IP check, vehicle road-vibration test. Iterate.
- Exit criteria: a unit that beats your Stage-0 rebrand on durability + looks + install time, documented in CAD.

### Stage 2 — Scale fabrication (when demand proven)
Pick the fab process by volume — do NOT tool up early.
- **Low–mid volume (10s–low 100s/mo): CNC + sheet-metal bend** via SendCutSend/Xometry. No tooling cost, per-part price higher. Best while volume is uncertain.
- **High volume (100s+/mo): die-cast aluminum or injection-molded housing** — tooling ~$5–30k (China), low per-part cost. Only after demand is proven and the design is frozen.
- Keep **assembly + QC + branding in-house** regardless — that's your value-add and quality control.

## What makes it scalable with 2 people
- **One frame, modular variants.** Single-plate and double-plate share parts; don't design two products.
- **Kitting.** Pre-bag a full per-unit BOM (frame, motor, module, fob, harness, fasteners). Assembly becomes repetitive, not a treasure hunt.
- **Jigs + test fixture (CAD-built).** A fixturing jig makes the ~10-min assembly real and consistent; a function-test rig (power + cycle + range check) makes QC fast. CAD partners pay off twice here — product *and* tooling.
- **Documented SOP + QC checklist.** Once written, you hand assembly to a contractor and scale labor linearly without you in the loop. This is the single biggest unlock for a 2-person team.
- **Batch runs (25–50), not one-offs.** Order components in matching batch quantities.
- **Fulfillment:** ship in-house while volume is low/high-value; move to a 3PL only when assembly time gets crowded out by packing.

## Quality system = the actual product differentiator
Cheap units fail on water ingress, position drift, and zero QC. Beat all three:
- **Frozen spec:** sealed worm gearmotor (self-locking), IP rating, fail-safe return-visible, rolling-code FCC fob, anodized frame, stainless hardware.
- **100% function test** every unit: flip-cycle, remote range, seal check. Log serial + result.
- **Warranty + RMA process.** A 1-yr warranty is impossible for AliExpress resellers and trivially credible once you test every unit.

## Where the CAD/contractor talent adds the most value (ranked)
1. **Proprietary frame** — fit, strength, sealing, cable management, branding boss.
2. **Assembly jig + function-test fixture** — makes 10-min assembly real and contractor-runnable.
3. **DFM for the chosen process** (sheet-metal vs cast) — saves tooling $ and scrap.
4. **Universal mounting-bracket system** — fits many vehicles → fewer SKUs and fewer returns.

## Capital & sequencing reality
- Spend order: Stage-0 inventory (low) → Stage-1 prototype/CNC (moderate) → Stage-2 tooling (only after proven demand). Never tool an injection mold on hope.
- Cash comes from Stage 0 while Stage 1 is designed — they overlap.

## The existential risk: legal (read before scaling)
Manufacturing your own makes **you the manufacturer** — more exposure than reselling.
- Some states ban **sale/manufacture/possession** (DE full ban; TN, FL; CA AB1085 = $1,000/device made or sold). Several are 2025–2026 and moving fast.
- **DMV note:** VA/MD/DC require unobstructed plates (use illegal); specific flipper statutes [unverified].
- Build the business around **off-road / show / track / film / private-property / export use only** — labeling, marketing copy, a point-of-sale attestation checkbox, and a **state shipping blocklist** (DE/TN/FL minimum; watch CA/IL).
- **Never** market toll/ticket/police evasion — that language is what's driving the bans.
- **Get a lawyer to confirm the shipping blocklist + your manufacturer exposure before Stage 2.**
- FCC: use an already-certified transmitter, label "Contains FCC ID: XXXX." Carry product-liability insurance.

## Immediate next moves
1. Run a Stage-0 batch of 5–10 upgraded units; time assembly, function-test, gather the frame gripes.
2. Brief your CAD partner on the Stage-1 frame goals above; start with a 3D-printed fit prototype.
3. Get a sealed worm gearmotor + Solidremote FCC fob sample on the bench to standardize internals now.
4. Book a lawyer consult on US sale/manufacture exposure + the shipping blocklist before any scale spend.
