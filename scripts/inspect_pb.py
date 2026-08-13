import sys, json, urllib.request

BASE = "http://localhost:8001/api/shopify/page/"
handles = [
    "faqs-raw-dog-food",
    "raw-pet-food-feeding-calculator",
    "contact",
    "raw-feeding-guide",
    "raw-starter-bundle",
    "terms-of-service",
]

def short(v, n=90):
    s = v if isinstance(v, str) else json.dumps(v)
    s = s.replace("\n", " ")
    return s[:n] + ("…" if len(s) > n else "")

def dump_node(node, indent="    "):
    t = node.get("type")
    h = node.get("handle")
    print(f"{indent}SECTION type={t} handle={h}")
    for f in (node.get("fields") or []):
        k = f.get("key"); ft = f.get("type"); val = f.get("value")
        ref = f.get("reference")
        refs = (f.get("references") or {}).get("nodes") if f.get("references") else None
        extra = ""
        if ref:
            if ref.get("image"): extra = f" [ref IMG]"
            elif ref.get("type"): extra = f" [ref MO {ref.get('type')}]"
        if refs:
            types = sorted(set((n.get('type') or ('IMG' if n.get('image') else '?')) for n in refs))
            extra += f" [refs x{len(refs)}: {types}]"
        print(f"{indent}  - {k} ({ft}) = {short(val) if val else ''}{extra}")
        # one level deeper for nested metaobjects in refs
        if refs:
            for n in refs[:1]:
                if n.get("fields"):
                    subkeys = [sf.get('key') for sf in n['fields']]
                    print(f"{indent}      nested[{n.get('type')}] keys: {subkeys}")

for hd in handles:
    try:
        with urllib.request.urlopen(BASE + hd) as r:
            p = json.load(r)
    except Exception as e:
        print(f"\n### {hd}: ERROR {e}")
        continue
    print(f"\n### PAGE {hd}  title={p.get('title')}  bodyLen={len(p.get('body') or '')}")
    mfs = p.get("metafields") or []
    if not mfs:
        print("   (no page_builder metafield)")
        continue
    for mf in mfs:
        nodes = (mf.get("references") or {}).get("nodes") or []
        print(f"   page_builder sections: {len(nodes)}")
        for n in nodes:
            dump_node(n)
