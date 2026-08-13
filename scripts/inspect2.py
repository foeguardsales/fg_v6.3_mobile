import json, urllib.request

def get(url):
    with urllib.request.urlopen(url) as r:
        return json.load(r)

# ---- FAQ items ----
p = get("http://localhost:8001/api/shopify/page/faqs-raw-dog-food")
for mf in p["metafields"]:
    for n in mf["references"]["nodes"]:
        if n.get("type") == "frequently_asked_questions_section":
            for f in n["fields"]:
                if f["key"] == "faq_category_groups":
                    for grp in f["references"]["nodes"]:
                        title = next((x.get("value") for x in grp["fields"] if x["key"]=="category_title"), None)
                        itemf = next((x for x in grp["fields"] if x["key"]=="faq_category_items"), None)
                        items = (itemf.get("references") or {}).get("nodes") if itemf else []
                        print(f"FAQ GROUP: {title!r} items={len(items)}")
                        if items:
                            print("  item type:", items[0].get("type"), "keys:", [x['key'] for x in items[0]['fields']])
                            for xf in items[0]['fields']:
                                print("     ", xf['key'], "=", str(xf.get('value'))[:80])
                        break

# ---- Starter bundle nested item keys ----
print("\n=== STARTER BUNDLE ===")
p = get("http://localhost:8001/api/shopify/page/raw-starter-bundle")
for mf in p["metafields"]:
    for n in mf["references"]["nodes"]:
        if n.get("type") == "raw_starter_bundle":
            for f in n["fields"]:
                ref = f.get("reference")
                if ref and ref.get("type"):
                    print(f"\n{f['key']} -> {ref['type']}")
                    for cf in ref.get("fields", []):
                        crefs = (cf.get("references") or {}).get("nodes") if cf.get("references") else None
                        if crefs:
                            print(f"  {cf['key']} = LIST x{len(crefs)} of {crefs[0].get('type')}: keys={[x['key'] for x in crefs[0]['fields']]}")
                        else:
                            print(f"  {cf['key']} = {str(cf.get('value'))[:60]}")
