#!/usr/bin/env python3
"""Ingest researched vendor data -> src/vendors.json for the hub.
First harvest reads the research vault (flipper-site-data). The overnight scraper appends to the
same shape. Generates copy-ready outreach messages per category. ponytail: deterministic, no deps."""
import json, glob, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
SRC = os.path.join(REPO, "src", "vendors.json")
# research vault lives next to the repo
RESEARCH = os.environ.get("RESEARCH_DIR",
    os.path.join(os.path.dirname(REPO), "research_and_vault", "flipper-site-data"))

def g(d, k):
    v = d.get(k, "")
    return "" if str(v).strip().lower() in ("unknown", "none", "n/a", "") else str(v).strip()

def region_of(country):
    c = country.lower()
    if any(x in c for x in ("united states", "usa", "u.s", "america")) and "south" not in c: return "USA"
    if "canada" in c: return "USA"
    if "china" in c: return "China"
    if any(x in c for x in ("uk", "united kingdom", "england", "germany", "france", "italy", "spain",
        "europe", "eu", "poland", "netherlands", "sweden", "australia", "turkey")): return "Intl"
    return "Intl" if c else "Other"

FLIP_BODY = ("We're Platinum Plates, a US brand (Washington DC) with a strong car-enthusiast following on "
 "TikTok & Instagram. We want a long-term OEM partner for motorized license-plate flippers, and CUSTOM LOGO "
 "is our top priority. Can you put OUR LOGO on the frame and/or packaging? Please share examples + setup fee. "
 "Specs: US 6 in x 12 in, single & double; metal frame; IP67 waterproof; self-locking; included rolling-code "
 "remote (FCC ID if possible). Please send: 1) logo options + setup fee; 2) price at 50/100/300 + MOQ; "
 "3) sample cost + lead time; 4) Trade Assurance; 5) shipping to USA. We'll sample then trial-order, "
 "reordering monthly. Thanks!")

def flip_msg(name):
    return f"Hi {name}, " + FLIP_BODY

def plate_msg(name, ful, method):
    intro = f"Hi {name}, we're Platinum Plates (Washington DC), selling custom durable license plates to a car-enthusiast audience. "
    if ful == "pod-dropship":
        return intro + "We're interested in print-on-demand dropship under our brand. Could you confirm: durability (won't rub off), per-unit price + any minimums, blind-ship/branding options, and store integration? We'll order a sample first. Thanks!"
    if ful == "on-demand-self-serve":
        return intro + "We'd like to produce custom metal plates on-demand from our designs. Could you confirm: material/finish options, durability, per-unit price + lead time, and whether there's any minimum? We'll order a sample first. Thanks!"
    if ful == "takes-your-blanks":
        return intro + "We supply our own 6x12 aluminum blanks. Do you print on customer-supplied blanks, and can you apply a clear abrasion-resistant laminate/topcoat so the print won't rub off? Please share method, price at 25/50/100, and turnaround. Sample batch first. Thanks!"
    return intro + f"Method of interest: {method or 'durable custom printing'}. Could you share durability, wholesale/dropship terms, MOQ, and turnaround? We'll test with a small order first. Thanks!"

def phone_digits(contact):
    if "whatsapp" not in contact.lower(): return ""
    m = re.search(r"\+?\d[\d\s\-]{8,}\d", contact)
    return re.sub(r"\D", "", m.group(0)) if m else ""

def norm(s): return re.sub(r"[^a-z0-9]", "", (s or "").lower())
def host(u):
    m = re.match(r"^(?:https?://)?([^/?#]+)", u or "")
    return m.group(1).lower().replace("www.", "") if m else ""

rows = []
# feasible flippers (ff-) + plates (pm-)
for f in glob.glob(os.path.join(RESEARCH, "ff-*.json")):
    try: d = json.load(open(f))
    except: continue
    if d.get("feasible") is False or d.get("completeness") == "partial": continue
    name = g(d, "name")
    if not name: continue
    url = g(d, "productUrl") or g(d, "url")
    rows.append(dict(name=name, category="flipper", region=region_of(g(d, "country")),
        fit=d.get("fitScore") or 0, moq=g(d, "moq"), link=url, linkLabel=g(d, "source")[:18] or "Open",
        contact=g(d, "contact"), whatsapp=phone_digits(g(d, "contact")), message=flip_msg(name),
        verified=bool(d.get("verified"))))
for f in glob.glob(os.path.join(RESEARCH, "pm-*.json")):
    try: d = json.load(open(f))
    except: continue
    if d.get("feasible") is False: continue
    name = g(d, "name")
    if not name: continue
    rows.append(dict(name=name, category="plate", region=region_of(g(d, "country")),
        fit=d.get("fitScore") or 0, moq=g(d, "moq"), link=g(d, "url"), linkLabel="Open",
        contact=g(d, "contact"), whatsapp=phone_digits(g(d, "contact")),
        message=plate_msg(name, g(d, "fulfilmentType"), g(d, "method")), verified=bool(d.get("verified"))))
# more flipper options from the original directory (whole-unit / retail only)
for f in glob.glob(os.path.join(RESEARCH, "mfr-*.json")):
    try: d = json.load(open(f))
    except: continue
    if d.get("category") not in ("whole-unit-oem", "premium-retail"): continue
    name = g(d, "name")
    if not name or name.lower().startswith("alibaba "): continue
    rows.append(dict(name=name, category="flipper", region=region_of(g(d, "country")),
        fit=d.get("fitScore") or 0, moq=g(d, "moq"), link=g(d, "url"), linkLabel=g(d, "source")[:18] or "Open",
        contact=g(d, "contact"), whatsapp=phone_digits(g(d, "contact")), message=flip_msg(name),
        verified=bool(d.get("verified"))))

# known direct WhatsApp (from outreach research)
for r in rows:
    if "zhenxin" in norm(r["name"]): r["whatsapp"] = "8618938509658"

# dedupe by name+host, keep highest fit
best = {}
for r in rows:
    k = norm(r["name"]) + "|" + host(r["link"])
    if k not in best or (r["fit"] or 0) > (best[k]["fit"] or 0):
        best[k] = r
out = sorted(best.values(), key=lambda r: (-(r["fit"] or 0), r["category"], r["name"]))

# clean empties
for r in out:
    for kk in ("moq", "contact", "whatsapp", "link", "linkLabel"):
        if not r.get(kk): r.pop(kk, None)

os.makedirs(os.path.dirname(SRC), exist_ok=True)
json.dump(out, open(SRC, "w"), indent=2, ensure_ascii=False)
fl = sum(1 for r in out if r["category"] == "flipper")
pl = sum(1 for r in out if r["category"] == "plate")
wa = sum(1 for r in out if r.get("whatsapp"))
from collections import Counter
reg = dict(Counter(r["region"] for r in out))
print(f"ingested {len(out)} vendors -> {SRC}")
print(f"  flipper={fl} plate={pl} whatsapp={wa} regions={reg}")
