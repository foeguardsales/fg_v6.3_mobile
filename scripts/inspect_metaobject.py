import os, json, httpx
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

domain = os.environ['SHOPIFY_STORE_DOMAIN']
token = os.environ['SHOPIFY_ADMIN_TOKEN']
ver = os.environ.get('SHOPIFY_API_VERSION', '2025-07')
url = f"https://{domain}/admin/api/{ver}/graphql.json"

q = """
query($type:String!){
  metaobjects(type:$type, first:10){
    edges{ node{
      id handle type
      fields{ key value type
        reference{ __typename ... on MediaImage { image { url } } }
        references(first:20){ edges{ node{ __typename ... on MediaImage { image { url } } } } }
      }
    }}
  }
}
"""

def run(t):
    r = httpx.post(url, headers={"X-Shopify-Access-Token": token, "Content-Type":"application/json"},
                   json={"query": q, "variables": {"type": t}}, timeout=30)
    return r.json()

for t in ["home_raw_benefits_section"]:
    print("==== TYPE:", t, "====")
    data = run(t)
    print(json.dumps(data, indent=2)[:6000])
