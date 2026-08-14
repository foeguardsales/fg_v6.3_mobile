# Auth-Gated App Testing Playbook (Emergent Auth)

## Step 1: Create Test User & Session (MongoDB)
Use the app's real DB name (from backend/.env DB_NAME). Example uses `foeguard`.
```
mongosh --eval "
use('foeguard');
var userId = 'user_test' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend API
```
curl -X GET "$BASE/api/auth/me" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```
Should return the user JSON (user_id, email, name), not 401.

## Step 3: Browser Testing
Set cookie `session_token` (httpOnly, secure, sameSite=None) for the app domain, then navigate to /account.

## Checklist
- users doc has custom `user_id` (UUID) field; queries use `{_id:0}` projection
- user_sessions.user_id matches users.user_id
- /api/auth/me returns user; /account renders without redirect to login
- Callback detection uses useLocation().hash

## Test Identities
Store allowed Google test accounts / linked users in /app/memory/test_credentials.md
(no passwords for Google OAuth flows).
