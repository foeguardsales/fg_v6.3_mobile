# FoeGuard – Test credentials

## Shopify test customer (Prompt 3 / 5 – customer auth)
- Email: `tester+1783282038@foeguard.dev`
- Password: `TestPass1234!`
- Storefront customerAccessToken (may be expired; re-issue via `POST /api/shopify/customers/login`): `c8c9f18629101262051f2940c506a790`

## Shopify webhook secret (Prompt 4)
- Env var: `SHOPIFY_WEBHOOK_SECRET`
- Dev value (in /app/backend/.env): `foeguard_dev_webhook_shared_secret_change_me`
- Signing algorithm: HMAC-SHA256 over the raw request body, then base64-encode.
- Header expected: `X-Shopify-Hmac-Sha256`

### Example test — cache purge via signed webhook
```bash
SECRET="foeguard_dev_webhook_shared_secret_change_me"
BODY='{"id":123,"handle":"chicken-neck-pet-treat"}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -binary | base64)
curl -X POST "$BACKEND/api/webhooks/shopify/products-update" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Hmac-Sha256: $SIG" \
  -H "X-Shopify-Topic: products/update" \
  -d "$BODY"
```

## Cache introspection (read-only)
- `GET  /api/webhooks/shopify/_cache` — returns hits/misses/bucket sizes
- `POST /api/webhooks/shopify/_cache/purge` — nukes everything (dev only)
