# Admin area

Everything for the `/admin` page lives in this folder.

| File | What it does |
|---|---|
| `admin-setup.sql` | The database side: who is an admin, the password check, and the rules that protect your tables |
| `AdminApp.jsx` | The `/admin` page: sign-in first, then the dashboard |
| `components/LoginScreen.jsx` | Step 1 (email + password) and step 2 (the emailed code) |
| `components/Dashboard.jsx` | The header and the three tabs |
| `components/InquiriesTab.jsx` | Every enquiry, with a **Done — remove** button |
| `components/ListingsTab.jsx` | Every listing, with **View** and **Remove** buttons |
| `components/AddListingForm.jsx` | The form for a new listing, with image-link previews |
| `components/styles.js` | Shared class names for fields and buttons |
| `lib/adminAuth.js` | The sign-in steps |
| `lib/adminData.js` | Reading and changing listings, enquiries and areas |

## How the sign-in works

1. You type your email and password. Supabase checks them.
2. Supabase emails you a 6-digit code (sent through your Gmail).
3. You type the code. That signs you in, and the database checks your
   password again before it marks this login as an **admin session** (valid
   for 8 hours, or until you sign out).

The database only lets an admin session add or remove listings and read or
delete enquiries. Someone with just your password, or just your inbox, can't
do either — not even by calling Supabase directly.

## One-time setup

1. **Create your admin account** — Supabase → Authentication → Users →
   **Add user** → **Create new user**. Enter your Gmail address and the
   password you want for `/admin`, and tick **Auto Confirm User**.

2. **Let Supabase send email through your Gmail.** Supabase's built-in email
   can't show a code (its templates are locked), so connect Gmail:

   a. Turn on **2-Step Verification** for your Google account
      (myaccount.google.com → Security).

   b. Create an **App Password** at https://myaccount.google.com/apppasswords
      (name it "Supabase"). Copy the 16-letter password — Google shows it once.
      App Passwords aren't available for work/school accounts, accounts with
      Advanced Protection, or 2-Step Verification that uses security keys only.

   c. Supabase → Authentication → Emails → **SMTP Settings** → turn on
      **Enable custom SMTP** and fill in:

      | Field | Value |
      |---|---|
      | Sender email | your Gmail address |
      | Sender name | e.g. `Dubai Property Explorer` |
      | Host | `smtp.gmail.com` |
      | Port | `465` (if that fails, try `587`) |
      | Username | your Gmail address |
      | Password | the 16-letter App Password, without spaces |

      Leave the minimum interval as it is, and **Save**.

   Keep the App Password only in Supabase — never in this project's code or
   `.env`. If it ever leaks, delete it on the App Passwords page. Changing your
   Google password also deletes it, and codes stop arriving until you make a
   new one and paste it into SMTP Settings again.

3. **Put the code in the email** — Authentication → Emails → Templates →
   **Magic Link**. Set the subject to `Your admin sign-in code` and the body to:

   ```html
   <h2>Your admin sign-in code</h2>
   <p>Enter this code to finish signing in:</p>
   <p style="font-size:28px;letter-spacing:6px"><strong>{{ .Token }}</strong></p>
   <p>If you didn't just try to sign in, change your password.</p>
   ```

   If the code you receive is longer than 6 digits, set **Email OTP Length**
   to 6 under Authentication → Sign In / Providers → Email.

4. **Run the SQL** — open `admin-setup.sql`, change `your-email@gmail.com`
   (section 5, near the end) to the email from step 1, then paste the whole
   file into SQL Editor and press **Run**. The result should show your email.

   This also switches on row level security for `listings`, `agent`, `media`,
   `uae_areas` and `inquiries`: the website can still read listings and send
   enquiries, but only a signed-in admin can change listings or see enquiries.

5. Open `http://localhost:5173/admin` and sign in.

## Limits

- With your own SMTP, Supabase starts at **30 emails per hour** (change it
  under Authentication → Rate Limits). Gmail has its own daily sending limit,
  far more than sign-ins need.
- A new code can be requested once a minute; each code expires after 1 hour.
