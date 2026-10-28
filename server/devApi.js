// server/devApi.js
// Vite plugin: serves /api/apply during `npm run dev` using the same handler Vercel runs in production.
// Server-side secrets (GMAIL_*, MAIL_*, SMTP_*) come from .env.local — they are never sent to the browser.
import { statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const apiFile = (name) => resolve(process.cwd(), `api/${name}.js`); // `npm run dev` always runs from the project root

export default function devApi(env = {}) {
    return {
        name: "dev-api-apply",
        apply: "serve",
        configureServer(server) {
            for (const [key, value] of Object.entries(env)) {
                if (/^(GMAIL|MAIL|SMTP|RESUME|SITE)_/.test(key)) process.env[key] = value;
            }
            for (const name of ["apply", "resume"]) {
                server.middlewares.use(`/api/${name}`, async (req, res) => {
                    try {
                        // ?t= busts Node's import cache so edits to api/*.js are picked up without a restart
                        const file = apiFile(name);
                        const mod = await import(`${pathToFileURL(file).href}?t=${statSync(file).mtimeMs}`);
                        await mod.default(req, res);
                    } catch (err) {
                        console.error(`[dev-api] /api/${name} crashed:`, err);
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ ok: false, error: "Dev API error — check the terminal running Vite." }));
                    }
                });
            }
        },
    };
}