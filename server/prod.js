// server/prod.js
// Runs api/apply.js as a tiny standalone Node server for a VPS (no Vercel needed).
// nginx serves the built site (dist/) and forwards /api/apply to this process. See DEPLOY_VPS.md.
//
//   node server/prod.js            (listens on 127.0.0.1:3001, change with PORT)
//
// Secrets (GMAIL_USER, GMAIL_APP_PASSWORD, MAIL_TO) are read from a `.env` file in the project folder
// on the server, or from real environment variables.
import http from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import handler from "../api/apply.js";
import resumeHandler, { cleanOldResumes } from "../api/resume.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* minimal .env loader (KEY=value per line; real environment variables win) */
for (const name of [".env", ".env.local"]) {
    const file = resolve(root, name);
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
        if (!m || line.trim().startsWith("#")) continue;
        const value = m[2].replace(/^(['"])(.*)\1$/, "$2");
        if (process.env[m[1]] === undefined) process.env[m[1]] = value;
    }
}

const PORT = Number(process.env.PORT) || 3001;

const routes = { "/api/apply": handler, "/api/resume": resumeHandler };

const server = http.createServer(async (req, res) => {
    const path = (req.url || "").split("?")[0];
    const route = routes[path];
    if (!route) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ ok: false, error: "Not found." }));
    }
    try {
        await route(req, res);
    } catch (err) {
        console.error(`[prod] ${path} crashed:`, err);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
        }
        res.end(JSON.stringify({ ok: false, error: "Something went wrong. Please try again." }));
    }
});

server.listen(PORT, "127.0.0.1", () => console.log(`[prod] apply API listening on http://127.0.0.1:${PORT}/api/apply`));

/* delete uploaded resumes older than RESUME_KEEP_DAYS (default 30): once at start, then every 6 hours */
const sweep = () => cleanOldResumes().then((n) => n && console.log(`[prod] deleted ${n} old resume upload(s)`)).catch((e) => console.error("[prod] cleanup failed:", e));
sweep();
setInterval(sweep, 6 * 60 * 60 * 1000);