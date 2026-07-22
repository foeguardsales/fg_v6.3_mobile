# Test Credentials

## Admin (created by backend/create_admin.py — reads from env ADMIN_EMAIL / ADMIN_PASSWORD)
- Email: Sales@foeguard.com
- Password: AAZA534BCD1!
- Note: credentials now live in backend/.env (ADMIN_EMAIL / ADMIN_PASSWORD), no longer hardcoded.
  Run `python backend/create_admin.py` to (re)create the admin in Mongo if needed.

## Regular users
- Created via /api/auth/register (email + password). No fixed seed user.
