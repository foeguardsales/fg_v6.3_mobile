# Test Credentials

The MealPlan quiz auto-creates a customer account on Save Profile using
whatever email + password the tester enters at step 8.  For testing use
a UNIQUE timestamp-suffixed email each run, e.g.:

- Email:    `zeus.<timestamp>@example.com`  (e.g. zeus.1721000000@example.com)
- Password: `pass1234`
- Name:     auto-derived on the server as "&lt;First dog name&gt;'s Parent"

localStorage keys after successful quiz:
- `token`                 — JWT (matches existing authService)
- `user`                  — { email, name, role }
- `foeguard_pet_profile`  — { email, saved_at, dogs: [...] }

For admin testing (not part of current scope):
- Admin login route: /admin/login
- No seed admin credentials have been set in this session.
