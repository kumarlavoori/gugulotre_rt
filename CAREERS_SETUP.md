# Careers page: setup guide

The **Careers** page (`/careers`) has an internship application form with two ways to apply:

1. **Submit application**: the details **and resume** are emailed automatically to your Gmail. The applicant never opens any mail app.
2. **Send on WhatsApp**: WhatsApp opens with the details already typed in. The applicant only presses send, and attaches
   the resume in the chat (a WhatsApp link can't carry a file). No setup or server needed for this one.

```
Careers form → POST /api/apply → Gmail (SMTP) → your inbox      (api/apply.js, runs on the server)
Careers form → wa.me/919392281448?text=…  → WhatsApp opens, prefilled, applicant presses send
```

---

## 1. Gmail app password (one-time, free)

Gmail doesn't allow your normal password for apps, so you create an **app password**:

1. Sign in to the Gmail account that will send (default `gugulotre@gmail.com`).
2. Turn on **2-Step Verification**: <https://myaccount.google.com/security>.
3. Open <https://myaccount.google.com/apppasswords>, create one (name it "Gugulotre website"), and copy the 16-letter password.
4. Put it in `.env.local` (see below). Spaces in the password are fine.

> The password is a secret. It only lives on the server (`.env.local` / your host's settings).
> Never prefix these variables with `VITE_`, and never commit `.env.local` (it is already git-ignored by `*.local`).

Gmail's free limit is about 500 emails per day, far more than internship applications need.

## 2. Run it locally

```bash
npm install                        # installs nodemailer
cp .env.example .env.local         # Windows PowerShell: copy .env.example .env.local
# open .env.local and fill in GMAIL_APP_PASSWORD
npm run dev
```

`.env.local`:

```
GMAIL_USER=gugulotre@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
MAIL_TO=gugulotre@gmail.com
```

- `GMAIL_USER`: the Gmail account that sends.
- `MAIL_TO`: where applications arrive (optional; defaults to `GMAIL_USER`). Can be a different address.
- The old `WHATSAPP_*` lines are no longer used. You can delete them.

Open <http://localhost:5173/careers>, fill the form, attach a PDF, submit. `npm run dev` serves `/api/apply`
too (via `server/devApi.js`), so no extra server is needed. If something fails, the real reason is printed in the
terminal running Vite. Applicants only ever see a friendly message.

Each email has the subject `New internship application: <name> (<domains>)`, the details in a table, and the resume attached.
Hitting **Reply** in Gmail answers the applicant directly (Reply-To is their email).

## 3. Deploy

`api/apply.js` is written as a **Vercel** serverless function:

1. Deploy the project to Vercel (framework preset: **Vite**). Anything inside `api/` becomes an endpoint automatically.
2. **Project → Settings → Environment Variables**: add `GMAIL_USER`, `GMAIL_APP_PASSWORD` and optionally `MAIL_TO`. Redeploy.
3. If you ever add a catch-all rewrite to `index.html` in `vercel.json`, exclude `/api/*` from it.

Static-only hosts (GitHub Pages, plain file hosting) **cannot** run this. Either move the site to Vercel, or port
`api/apply.js` to your host's function format (Netlify Functions, Cloudflare Workers, a small Node server). The logic is
one self-contained file. If the API lives on another domain, set `VITE_APPLY_ENDPOINT` to its full URL.

## 4. Quick test checklist

- [ ] Submit with everything empty → red field errors, nothing sent.
- [ ] Attach a `.png` as the resume → rejected (only PDF, DOC, DOCX, up to 3 MB).
- [ ] Valid application → "Application sent!" and an email with the resume attached arrives in the inbox (check Spam the first time).
- [ ] **Send on WhatsApp** with required fields empty → red field errors, WhatsApp doesn't open (resume is not required here).
- [ ] **Send on WhatsApp** with the form filled → WhatsApp opens to `919392281448` with the message typed in.
- [ ] Temporarily break `GMAIL_APP_PASSWORD` → applicant sees a friendly error with a WhatsApp link; the terminal / Vercel logs show the real error.

## 5. If it doesn't arrive

Check the terminal (local) or **Vercel → Logs**:

| Log shows | Usually means |
|---|---|
| `EAUTH 535` | Wrong app password, or 2-Step Verification is off. Create a new app password. |
| `GMAIL_USER / GMAIL_APP_PASSWORD are not set` | The env vars are missing (restart `npm run dev` after editing `.env.local`; on Vercel, redeploy). |
| `ETIMEDOUT` / `ECONNECTION` | The network blocks outgoing SMTP (port 465). Try another network or host. |
| Sent fine but not in Inbox | Look in Spam, and mark it "Not spam". |

## 6. Built-in protection

- Resume is checked by its real file signature, not just the name (a renamed `.exe` is rejected). Max 3 MB.
- A hidden "honeypot" field quietly drops most bots.
- Best-effort rate limit: 5 applications per connection per 10 minutes (per server instance). Add Vercel's
  firewall / rate limiting or a CAPTCHA if you start seeing real abuse.
- The server logs the real error but never shows it (or your app password) to visitors.
- Applicants' phone, email and resume are personal data; the Privacy Policy page describes how they are handled.