import json, urllib.request

def get(url):
    with urllib.request.urlopen(url) as r:
        return json.load(r)

# FAQ category group -> items structure
p = get("http://localhost:8001/api/shopify/page/faqs-raw-dog-food")
for mf in p["metafields"]:
    for n in mf["references"]["nodes"]:
        if n.get("type") == "frequently_asked_questions_section":
            for f in n["fields"]:
                if f["key"] == "faq_category_groups":
                    grp = f["references"]["nodes"][0]
                    print("GROUP type:", grp.get("type"), "fields:", [x["key"] for x in grp["fields"]])
                    for gf in grp["fields"]:
                        if gf["key"] == "category_title":
                            print("  category_title=", gf.get("value"))
                        if gf["key"] == "faq_category_items":
                            refs = (gf.get("references") or {}).get("nodes") or []
                            print("  items count:", len(refs))
                            if refs:
                                it = refs[0]
                                print("  item type:", it.get("type"), "keys:", [x["key"] for x in (it.get("fields") or [])])
                                for xf in (it.get("fields") or []):
                                    print("     ", xf["key"], "=", str(xf.get("value"))[:70])

# Starter bundle referenced metaobjects
print("\n=== STARTER BUNDLE refs ===")
p = get("http://localhost:8001/api/shopify/page/raw-starter-bundle")
for mf in p["metafields"]:
    for n in mf["references"]["nodes"]:
        if n.get("type") == "raw_starter_bundle":
            for f in n["fields"]:
                ref = f.get("reference")
                if ref and ref.get("type"):
                    print(f"{f['key']} -> {ref['type']} keys: {[x['key'] for x in (ref.get('fields') or [])]}")
