// api/apply.js
// Receives an internship application from the /careers form and emails the
// details + resume (attached) to the team's Gmail automatically — the applicant
// never has to open any mail app.
//
// Runs as a Vercel serverless function (POST /api/apply). In `npm run dev` the
// same file is mounted by server/devApi.js, so there is one code path.
// Setup: see CAREERS_SETUP.md.

const MAX_RESUME_BYTES = 3_000_000; // keeps the JSON body under Vercel's 4.5 MB limit
const MAX_BODY_BYTES = 5_000_000;

// Allowed resume formats: mime type -> file signature (checked against the real bytes)
const RESUME_TYPES = {
    "application/pdf": { ext: "pdf", magic: [0x25, 0x50, 0x44, 0x46] },
    "application/msword": { ext: "doc", magic: [0xd0, 0xcf, 0x11, 0xe0] },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { ext: "docx", magic: [0x50, 0x4b] },
};

const STATES = ["Telangana", "Andhra Pradesh", "Other"]; // keep in sync with the form

const GENERIC_FAIL = "We couldn't deliver your application right now. Please try again in a few minutes.";

/* ── tiny helpers ── */
const httpError = (status, message) => Object.assign(new Error(message), { status });

// Control characters are stripped on purpose (they could be used for email header injection).
const oneLine = (v, max) =>
    // eslint-disable-next-line no-control-regex
    String(v ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, max);

const multiLine = (v, max) =>
    // eslint-disable-next-line no-control-regex
    String(v ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);

function send(res, status, body, headers = {}) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
    res.end(JSON.stringify(body));
}

async function readJson(req) {
    if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body; // Vercel pre-parsed
    let raw = typeof req.body === "string" ? req.body : null;
    if (raw === null) {
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
            size += chunk.length;
            if (size > MAX_BODY_BYTES) throw httpError(413, "That file is too large. Please upload a resume under 3 MB.");
            chunks.push(chunk);
        }
        raw = Buffer.concat(chunks).toString("utf8");
    }
    try { return JSON.parse(raw); } catch { throw httpError(400, "Invalid request."); }
}

/* ── best-effort rate limit (per warm instance) so the endpoint can't be used to spam the inbox ── */
const hits = new Map();
function rateLimit(req) {
    const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
    if (recent.length >= 5) throw httpError(429, "Too many applications from this connection. Please try again later.");
    recent.push(now);
    hits.set(ip, recent);
}

/* ── validate + clean the submitted form ── */
function parseApplication(body) {
    const app = {
        name: oneLine(body.name, 80),
        phone: oneLine(body.phone, 25),
        email: oneLine(body.email, 120),
        city: oneLine(body.city, 80),
        state: oneLine(body.state, 30),
        stateOther: oneLine(body.stateOther, 60),
        college: oneLine(body.college, 120),
        course: oneLine(body.course, 80),
        tracks: (Array.isArray(body.tracks) ? body.tracks : []).slice(0, 8).map((t) => oneLine(t, 40)).filter(Boolean),
        skills: multiLine(body.skills, 300),
        link: oneLine(body.link, 200),
        message: multiLine(body.message, 600),
    };
    const digits = app.phone.replace(/\D/g, "");
    if (!app.name) throw httpError(400, "Please enter your name.");
    if (digits.length < 10 || digits.length > 15) throw httpError(400, "Please enter a valid phone number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email)) throw httpError(400, "Please enter a valid email address.");
    if (!app.city) throw httpError(400, "Please enter your city or district.");
    if (!STATES.includes(app.state)) throw httpError(400, "Please choose your state.");
    if (app.state === "Other" && !app.stateOther) throw httpError(400, "Please enter your state.");
    if (!app.tracks.length) throw httpError(400, "Please choose at least one domain.");
    app.location = `${app.city}, ${app.state === "Other" ? app.stateOther : app.state}`;

    app.resume = parseResume(body.resume, app.name);
    return app;
}

/* ── resume file check (also used by api/resume.js) ── */
function parseResume(r, applicantName) {
    const type = RESUME_TYPES[r?.type];
    if (!type || typeof r?.data !== "string") throw httpError(400, "Please attach your resume as a PDF, DOC or DOCX file.");
    const buffer = Buffer.from(r.data, "base64");
    if (!buffer.length) throw httpError(400, "The resume file looks empty.");
    if (buffer.length > MAX_RESUME_BYTES) throw httpError(413, "That file is too large. Please upload a resume under 3 MB.");
    if (!type.magic.every((byte, i) => buffer[i] === byte)) throw httpError(400, "That file doesn't look like a valid PDF, DOC or DOCX.");

    const safeName = (oneLine(r.name, 80).replace(/\.[^.]*$/, "").replace(/[^\w\- ]+/g, "").trim() || "resume");
    const applicant = String(applicantName ?? "").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_") || "applicant";
    return { buffer, mime: r.type, filename: `${applicant}_${safeName}.${type.ext}`.slice(0, 100) };
}

/* ── Gmail (SMTP) ── */
function config() {
    const cfg = {
        user: (process.env.GMAIL_USER || "").trim(),
        pass: (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, ""), // Google shows app passwords in groups of 4 with spaces
        to: (process.env.MAIL_TO || process.env.GMAIL_USER || "").trim(), // who receives applications
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
    };
    if (!cfg.user || !cfg.pass || !cfg.to) {
        console.error("[apply] GMAIL_USER / GMAIL_APP_PASSWORD are not set");
        throw httpError(503, GENERIC_FAIL);
    }
    return cfg;
}

const escapeHtml = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function mailContent(app) {
    const rows = [
        ["Name", app.name],
        ["Phone", app.phone],
        ["Email", app.email],
        ["Location", app.location],
        ["College", app.college],
        ["Course / year", app.course],
        ["Domain", app.tracks.join(", ")],
        ["Skills", app.skills],
        ["Link", app.link],
        ["Why Gugulotre", app.message],
    ].filter(([, value]) => value); // skip empty optional fields

    const text = ["New internship application", "", ...rows.map(([k, v]) => `${k}: ${v}`), "", `Resume attached: ${app.resume.filename}`].join("\n");
    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222">
<h2 style="margin:0 0 12px">New internship application</h2>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="font-weight:bold;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join("\n")}
</table>
<p style="margin-top:14px">&#128206; Resume attached: ${escapeHtml(app.resume.filename)}</p>
</div>`;
    return { text, html };
}

async function deliver(cfg, app) {
    const { default: nodemailer } = await import("nodemailer"); // loaded only when an application is actually sent
    const transport = nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.port === 465,
        auth: { user: cfg.user, pass: cfg.pass },
        connectionTimeout: 15_000,
        greetingTimeout: 15_000,
        socketTimeout: 30_000,
    });
    const { text, html } = mailContent(app);
    try {
        await transport.sendMail({
            from: { name: `${app.name} (Applicant)`, address: cfg.user }, // Gmail only allows sending from your own address; the name shown is the applicant's
            to: cfg.to,
            replyTo: { name: app.name, address: app.email }, // hitting Reply in Gmail answers the applicant
            subject: `${app.name}: New internship application (${app.tracks.join(", ")})`.slice(0, 200), // name first, so it is the first thing you see in the inbox list
            text,
            html,
            attachments: [{ filename: app.resume.filename, content: app.resume.buffer, contentType: app.resume.mime }],
        });
    } catch (err) {
        // Logged for the site owner (Vercel logs / dev terminal); never shown to the applicant.
        console.error("[apply] Gmail send failed:", err.code || "", err.responseCode || "", err.message);
        throw httpError(502, GENERIC_FAIL);
    } finally {
        transport.close();
    }
}

/* ── handler ── */
export default async function handler(req, res) {
    if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed." }, { Allow: "POST" });
    try {
        const body = await readJson(req);
        if (oneLine(body.website, 50)) return send(res, 200, { ok: true }); // honeypot: bots fill hidden fields
        rateLimit(req);
        const app = parseApplication(body);
        const cfg = config();
        await deliver(cfg, app);
        return send(res, 200, { ok: true });
    } catch (err) {
        if (err.status) return send(res, err.status, { ok: false, error: err.message });
        console.error("[apply] unexpected error:", err);
        return send(res, 500, { ok: false, error: GENERIC_FAIL });
    }
}

export { GENERIC_FAIL, httpError, oneLine, parseResume, rateLimit, readJson, send };