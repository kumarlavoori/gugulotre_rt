// src/lib/applyClient.js
// Validation + submit helper for the internship application form (CareersPage).
// The form posts JSON (resume as base64) to /api/apply, which emails it to the team's Gmail — see api/apply.js.
// It can also open WhatsApp with the details prefilled (buildWhatsAppUrl) — the applicant just taps send.

export const RESUME_MAX_BYTES = 3_000_000; // keep in sync with api/apply.js
export const RESUME_ACCEPT = ".pdf,.doc,.docx";

const MIME_BY_EXT = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const ENDPOINT = import.meta.env.VITE_APPLY_ENDPOINT || "/api/apply";
const RESUME_ENDPOINT = ENDPOINT.replace(/apply$/, "resume");

const extOf = (file) => (file.name.split(".").pop() || "").toLowerCase();

/** Returns an error message, or "" if the file is acceptable. */
export function checkResume(file) {
    if (!file) return "Please attach your resume";
    if (!MIME_BY_EXT[extOf(file)]) return "Resume must be a PDF, DOC or DOCX file";
    if (file.size === 0) return "That file looks empty";
    if (file.size > RESUME_MAX_BYTES) return "Resume must be under 3 MB";
    return "";
}

export const formatSize = (bytes) => (bytes < 1_000_000 ? `${Math.max(1, Math.round(bytes / 1000))} KB` : `${(bytes / 1_000_000).toFixed(1)} MB`);

/** Returns { fieldName: "message" } — empty object means valid. Pass { requireResume: false } for the WhatsApp option (a link can't carry a file). */
export function validateApplication(form, tracks, resume, { requireResume = true } = {}) {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    const digits = form.phone.replace(/\D/g, "");
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (digits.length < 10 || digits.length > 15) e.phone = "Enter a valid phone number";
    if (!form.city.trim()) e.city = "City or district is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address";
    if (!form.state) e.state = "Choose your state";
    else if (form.state === "Other" && !form.stateOther.trim()) e.stateOther = "Enter your state";
    if (!tracks.length) e.tracks = "Choose at least one domain";
    if (requireResume) {
        const resumeError = checkResume(resume);
        if (resumeError) e.resume = resumeError;
    }
    return e;
}

/** wa.me link that opens WhatsApp with the application already typed in; the applicant only has to press send. */
export function buildWhatsAppUrl(number, form, tracks, resumeUrl = "") {
    const line = (label, value) => (value && value.trim() ? `*${label}:* ${value.trim()}` : null); // skip empty optional fields
    const state = form.state === "Other" ? form.stateOther : form.state;
    const text = [
        "*New internship application*",
        "",
        line("Name", form.name),
        line("Phone", form.phone),
        line("Email", form.email),
        line("Location", `${form.city.trim()}, ${state.trim()}`),
        line("College", form.college),
        line("Course / year", form.course),
        line("Domain", tracks.join(", ")),
        line("Skills", form.skills),
        line("Link", form.link),
        line("Why Gugulotre", form.message),
        "",
        resumeUrl ? `Resume: ${resumeUrl}` : "I'll attach my resume in this chat.",
    ].filter((l) => l !== null).join("\n");
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = () => reject(new Error("We couldn't read that file. Please choose it again."));
        reader.readAsDataURL(file);
    });

/** Sends the application. Resolves on success; throws Error(userFriendlyMessage) otherwise. */
export async function submitApplication({ form, tracks, resume, website = "" }) {
    const data = await toBase64(resume);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60_000);
    let res;
    try {
        res = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
                name: form.name, phone: form.phone, email: form.email,
                city: form.city, state: form.state, stateOther: form.stateOther,
                college: form.college, course: form.course,
                tracks, skills: form.skills, link: form.link, message: form.message,
                website, // honeypot — real visitors leave this empty
                resume: { name: resume.name, type: MIME_BY_EXT[extOf(resume)], data },
            }),
        });
    } catch (err) {
        throw new Error(err.name === "AbortError"
            ? "This is taking too long. Check your connection and try again."
            : "Couldn't reach the server. Check your connection and try again.", { cause: err });
    } finally {
        clearTimeout(timer);
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong. Please try again.");
}

/** Uploads the resume so the WhatsApp message can carry a download link. Returns the link, or "" if it failed
 *  (the message then asks the applicant to attach the resume in the chat instead). */
export async function uploadResume({ name, resume }) {
    try {
        const data = await toBase64(resume);
        const res = await fetch(RESUME_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(30_000),
            body: JSON.stringify({ name, resume: { name: resume.name, type: MIME_BY_EXT[extOf(resume)], data } }),
        });
        const json = await res.json().catch(() => ({}));
        return res.ok && json.ok && typeof json.url === "string" ? json.url : "";
    } catch {
        return "";
    }
}