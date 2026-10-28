# Put the site live on your VPS (with automatic Gmail sending)

Upload with FileZilla (SFTP) as usual. The only extra step is running a tiny Node service for the careers form.

```
Browser → nginx → static site (dist/)
                → /api/apply → Node service (server/prod.js, port 3001) → Gmail
```

## 1. Build the site (on your computer)

```bash
npm run build
```

Upload everything inside `dist/` to your site folder on the VPS (for example `/var/www/gugulotre`). Use the same folder you use today.

## 2. Upload the API files (FileZilla)

Make a folder on the VPS, for example `/var/www/gugulotre-api`, and upload only these, keeping the folder structure:

```
gugulotre-api/
  api/apply.js
  server/prod.js
  package.json
  package-lock.json
  .env          ← create this on the server (see below)
```

## 3. Install and start (SSH, one time)

Needs Node 18 or newer (`node -v`).

```bash
cd /var/www/gugulotre-api
npm install --omit=dev
nano .env
```

Put this in `.env` (real password, no quotes):

```
GMAIL_USER=gugulotre@gmail.com
GMAIL_APP_PASSWORD=your 16-letter app password
MAIL_TO=gugulotre@gmail.com
```

Keep it private: `chmod 600 .env`

Start it and keep it running, including after a reboot:

```bash
npm install -g pm2
pm2 start server/prod.js --name gugulotre-api
pm2 save
pm2 startup        # run the command it prints
```

Check it: `pm2 logs gugulotre-api` should show `apply API listening on http://127.0.0.1:3001/api/apply`.

## 4. nginx: send /api/ to the service

Inside the `server { ... }` block of your site (usually `/etc/nginx/sites-available/<your-site>`), add:

```nginx
    client_max_body_size 5m;   # resumes are sent inside the request (up to ~4 MB), the default 1m would block them

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
```

If your site is a React app with a catch-all `try_files $uri /index.html;`, keep that for `location /`, and keep this `/api/` block separate. Then:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Test

Open `https://yourdomain/careers`, submit with a PDF, and check the Gmail inbox (and Spam the first time).
If it fails: `pm2 logs gugulotre-api` shows the real reason (`EAUTH 535` = wrong app password).

## Updating later

- Site changes: `npm run build` and upload `dist/` again.
- Changed `api/apply.js` or `.env`: upload it, then `pm2 restart gugulotre-api`.

## Notes

- Some VPS providers block outgoing SMTP ports. Gmail on port 465 is usually allowed. If you see `ETIMEDOUT`, tell me and we'll switch to port 587.
- The "Send on WhatsApp" button needs none of this. It works on any hosting.