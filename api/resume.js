// api/resume.js
// Saves an applicant's resume on the server and returns a download link, so the "Send on WhatsApp"
// message can carry the resume as a link (a wa.me link itself cannot carry a file).
// Needs a normal server with a writable disk (your VPS) — not Vercel. Files are deleted after
// RESUME_KEEP_DAYS days (default 30) by cleanOldResumes(), which server/prod.js runs on a timer.
// nginx serves the folder at /resumes/ — see DEPLOY_VPS.md.
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GENERIC_FAIL, httpError, oneLine, parseResume, rateLimit, readJson, send } from "./apply.js";

const DIR = process.env.RESUME_DIR || resolve(dirname(fileURLToPath(import.meta.url)), "..", "resumes");
const KEEP_DAYS = Number(process.env.RESUME_KEEP_DAYS) || 30;
const MAX_TOTAL_BYTES = (Number(process.env.RESUME_MAX_MB) || 1000) * 1_000_000; // stop accepting uploads past ~1 GB
const SITE = (process.env.SITE_URL || "https://www.gugulotre.com").replace(/\/+$/, "");
const FOLDER = /^[0-9a-f]{32}$/; // every upload lives in its own random folder; only these are ever touched

async function folders() {
    try { return (await readdir(DIR)).filter((n) => FOLDER.test(n)); } catch { return []; }
}

/** Deletes uploads older than KEEP_DAYS. Returns how many were removed. */
export async function cleanOldResumes() {
    const cutoff = Date.now() - KEEP_DAYS * 86_400_000;
    let removed = 0;
    for (const name of await folders()) {
        const path = resolve(DIR, name);
        try {
            if ((await stat(path)).mtimeMs < cutoff) { await rm(path, { recursive: true, force: true }); removed++; }
        } catch { /* already gone */ }
    }
    return removed;
}

async function usedBytes() {
    let total = 0;
    for (const name of await folders()) {
        try {
            for (const file of await readdir(resolve(DIR, name))) total += (await stat(resolve(DIR, name, file))).size;
        } catch { /* ignore */ }
    }
    return total;
}

export default async function handler(req, res) {
    if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed." }, { Allow: "POST" });
    try {
        const body = await readJson(req);
        rateLimit(req);
        const file = parseResume(body.resume, oneLine(body.name, 80));
        if ((await usedBytes()) + file.buffer.length > MAX_TOTAL_BYTES) {
            console.error("[resume] storage limit reached; delete old files or raise RESUME_MAX_MB");
            throw httpError(503, GENERIC_FAIL);
        }
        const id = randomBytes(16).toString("hex"); // 128-bit random: the link cannot be guessed
        const filename = file.filename.replace(/\s+/g, "_");
        await mkdir(resolve(DIR, id), { recursive: true, mode: 0o755 });
        await writeFile(resolve(DIR, id, filename), file.buffer, { mode: 0o644 });
        return send(res, 200, { ok: true, url: `${SITE}/resumes/${id}/${encodeURIComponent(filename)}` });
    } catch (err) {
        if (err.status) return send(res, err.status, { ok: false, error: err.message });
        console.error("[resume] unexpected error:", err);
        return send(res, 500, { ok: false, error: GENERIC_FAIL });
    }
}