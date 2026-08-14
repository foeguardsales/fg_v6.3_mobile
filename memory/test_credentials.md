# Test Credentials

## Customer auth — Email/Password (restored) + Emergent Google  [UPDATED 2026-07]
Customers can now sign in / create an account with EMAIL + PASSWORD on /account
(tabs "Sign In" / "Create Account", plus "Forgot your password?" and a "Continue with
Google" fallback). Email/password go to the backend which creates/authenticates a REAL
Shopify customer via the Storefront Customer API, then stores a 7-day session cookie.
- Backend endpoints: POST /api/auth/signup {email,password,firstName,lastName},
  POST /api/auth/signin {email,password}, POST /api/auth/recover {email},
  GET /api/auth/session, POST /api/auth/logout, POST /api/auth/session (Google exchange).
- Verified live: signup creates gid://shopify/Customer/... and signin returns a session.
- To create a throwaway test customer: POST /api/auth/signup with any unique email + password.

## (legacy) Seed a session directly in Mongo (still works)
Customers can also sign in/up via Emergent Google auth. To test auth-gated flows, seed a
session directly in Mongo (DB_NAME=foeguard) and use it as a cookie/Bearer token:

```
mongosh --eval "
use('foeguard');
var uid='user_'+Date.now();
var tok='test_session_'+Date.now();
db.users.insertOne({user_id:uid,email:'test.user.'+Date.now()+'@example.com',name:'Test User',picture:'',role:'customer',created_at:new Date()});
db.user_sessions.insertOne({session_token:tok,user_id:uid,email:'seed@test.com',expires_at:new Date(Date.now()+7*24*3600*1000),created_at:new Date()});
print('TOKEN '+tok);
"
```
- Backend session check: `GET /api/auth/session` with `Authorization: Bearer <TOKEN>` OR cookie `session_token=<TOKEN>` -> {authenticated:true, user:{...}}
- Endpoints: POST /api/auth/session (exchange session_id), GET /api/auth/session, POST /api/auth/logout

## Admin (Mongo/JWT — unchanged, separate from customer auth)
- Reads from backend/.env ADMIN_EMAIL / ADMIN_PASSWORD (currently admin@foeguard.com / Admin123!)
- Login: POST /api/auth/login {email,password}; used by /admin/login UI.
- Run `python backend/create_admin.py` to (re)create the admin in Mongo if it doesn't exist.
