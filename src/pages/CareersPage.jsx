import { useState, useEffect, useRef, useId } from "react";
import { C } from "../components/theme";
import { RESUME_ACCEPT, buildWhatsAppUrl, checkResume, formatSize, submitApplication, uploadResume, validateApplication } from "../lib/applyClient";

const WA_NUMBER = "919392281448";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;
const EMAIL = "gugulotre@gmail.com";

/* The same seven services, in the same order, as the home-page "currently building" panel (E-Commerce is the full-width "3 + 1 + 3" row). */
const TRACKS = [
    { label: "Web Development", icon: "🌐", color: "#3887FD", desc: "Ultra-fast, SEO-optimised websites, web apps, and e-commerce stores built for conversion from day one.", tools: ["React", "Next.js", "TypeScript", "Django", "PostgreSQL"] },
    { label: "Graphic Design", icon: "🎨", color: "#FF5FA2", desc: "Bold logos, brand systems, and print-ready assets — every visual crafted to make your brand impossible to ignore.", tools: ["Illustrator", "Photoshop", "InDesign", "Figma"] },
    { label: "Video Editing", icon: "🎬", color: "#9B8CFF", desc: "Scroll-stopping reels, promos, and brand videos — cut, graded, and sound-designed to hold attention.", tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut Pro", "CapCut Pro"] },
    { label: "E-Commerce", icon: "🛒", color: "#FF4D8F", wide: true, desc: "Custom online stores plus full seller account management — listings, orders, ads, pricing & performance — across Flipkart, Amazon, Meesho, Blinkit & Instamart.", tools: ["Flipkart", "Amazon", "Meesho", "Shopify", "WooCommerce"] },
    { label: "UI / UX Design", icon: "✏️", color: "#FF006B", desc: "Design-first sprints in Figma — wireframes to polished interfaces before a line of code.", tools: ["Figma", "FigJam", "Prototyping", "Design Systems"] },
    { label: "WordPress & CMS", icon: "🧩", color: "#5A9DFE", desc: "Custom themes and plugins from scratch — no page builders, no bloat, just fast.", tools: ["WordPress", "PHP", "ACF Pro", "WooCommerce", "Yoast SEO"] },
    { label: "App Development", icon: "📱", color: "#7C9CFF", desc: "Cross-platform iOS & Android apps with Flutter, including e-commerce and shopping apps — one codebase, native performance.", tools: ["Flutter", "Dart", "React Native", "Firebase"] },
];

/* Type scale — reused from the existing pages so Careers matches the rest of the site:
   hero paragraph → Contact · section paragraph → About · card title → Outfit Bold, sized up so it reads comfortably
   card body → About / Contact · CTA buttons → Contact · small pill buttons → most-used Syne size · pills → Home panel */
const FS = {
    heroP: (sm) => (sm ? "0.8rem" : "clamp(0.82rem,1.4vw,0.96rem)"),
    sectionP: (sm) => (sm ? "0.83rem" : "0.92rem"),
    cardTitle: (sm) => (sm ? "1.08rem" : "1.15rem"),
    cardBody: (sm) => (sm ? "0.8rem" : "0.85rem"),
    btn: (sm) => (sm ? "0.8rem" : "0.88rem"),
    btnSm: "0.72rem",
    pill: "0.65rem",
};

/* Where applicants are from. The page never says who is preferred; the answer is only passed to the team. */
const STATES = ["Telangana", "Andhra Pradesh", "Other"];

const PERKS = [
    { icon: "🎓", title: "Free internship", text: "There is no fee to apply or to join.", tint: "rgba(255, 0, 107,0.09)" },
    { icon: "🛠️", title: "Real-time project work", text: "You work on real projects as they happen, with the Gugulotre team — not practice exercises.", tint: "rgba(56,135,253,0.12)" },
    { icon: "📜", title: "Certificate", text: "You receive a Gugulotre certificate when you complete the internship.", tint: "rgba(124,156,255,0.16)" },
];

const MQ = ["Free Internship", "Real Projects", "Certificate", "Web Development", "Graphic Design", "Video Editing", "E-Commerce", "UI / UX Design", "WordPress & CMS", "App Development"];

/* ════ HOOKS ════ */
function useWindowWidth() {
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
    useEffect(() => {
        const h = () => setW(window.innerWidth);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);
    return w;
}

const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

/* ════ REVEAL ════ */
function Reveal({ children, delay = 0, style = {} }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
            { threshold: 0.05 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(18px)",
            transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
            ...style,
        }}>{children}</div>
    );
}

/* ════ SECTION TAG ════ */
function STag({ children, light = false }) {
    return (
        <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: light ? "rgba(247,243,236,0.55)" : C.inkSoft,
            display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.9rem",
        }}>
            <span style={{ width: 18, height: 2, background: C.coral, display: "inline-block", flexShrink: 0 }} />
            {children}
        </div>
    );
}

/* ════ MARQUEE ════ */
function Marquee({ items }) {
    const tripled = [...items, ...items, ...items];
    return (
        <div style={{ background: C.purpleMid, padding: "0.75rem 0", overflow: "hidden" }} aria-hidden="true">
            <div style={{ display: "flex", gap: "2.5rem", whiteSpace: "nowrap", width: "max-content", animation: "marquee 32s linear infinite" }}>
                {tripled.map((item, i) => (
                    <span key={i} style={{
                        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em", textTransform: "uppercase",
                        flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "0.55rem",
                    }}>
                        {item}<span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.38rem" }}>●</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ════ FLOATING LABEL INPUT ════ */
function FloatInput({ label, type = "text", value, onChange, required, multiline = false, rows = 4, error, name, autoComplete, inputMode, maxLength }) {
    const id = useId();
    const [focused, setFocused] = useState(false);
    const active = focused || value?.length > 0;
    const base = {
        width: "100%", background: "transparent", border: "none", outline: "none",
        fontFamily: "'Outfit',sans-serif", fontSize: "0.94rem", color: C.ink,
        resize: "none", padding: "1.55rem 1.1rem 0.5rem", boxSizing: "border-box",
    };
    const shared = {
        id, name, value, onChange, autoComplete, inputMode, maxLength,
        onFocus: () => setFocused(true), onBlur: () => setFocused(false),
        "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${id}-err` : undefined,
        required,
    };
    return (
        <div data-field={name}>
            <div style={{
                position: "relative", background: "#fff",
                border: `1.5px solid ${error ? C.coral : focused ? C.coral : active ? "rgba(255, 0, 107,0.3)" : "#EAE4D8"}`,
                borderRadius: 12, transition: "border-color 0.25s, box-shadow 0.25s",
                boxShadow: focused ? "0 0 0 3px rgba(255, 0, 107,0.07)" : "none",
            }}>
                <label htmlFor={id} style={{
                    position: "absolute", left: "1.1rem",
                    top: active ? "0.4rem" : multiline ? "1rem" : "50%",
                    transform: active || multiline ? "none" : "translateY(-50%)",
                    fontFamily: "'Syne',sans-serif",
                    fontSize: active ? "0.59rem" : "0.8rem",
                    fontWeight: active ? 700 : 500,
                    color: focused || error ? C.coral : C.inkSoft,
                    letterSpacing: active ? "0.1em" : "0.02em",
                    textTransform: active ? "uppercase" : "none",
                    transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
                    pointerEvents: "none", zIndex: 2,
                }}>{label}{required && <span style={{ color: C.coral }}> *</span>}</label>
                {multiline
                    ? <textarea rows={rows} {...shared} style={{ ...base, paddingTop: "1.65rem", lineHeight: 1.7 }} />
                    : <input type={type} {...shared} style={{ ...base, height: 52 }} />}
            </div>
            {error && <div id={`${id}-err`} role="alert" style={errStyle}>{error}</div>}
        </div>
    );
}

const boxStyle = (hasError, sm) => ({ background: "#fff", borderRadius: 12, border: `1.5px solid ${hasError ? C.coral : "#EAE4D8"}`, padding: sm ? "0.9rem 0.95rem" : "1.1rem 1.2rem" });
const boxLabelStyle = (hasError) => ({ fontFamily: "'Syne',sans-serif", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: hasError ? C.coral : C.inkSoft, marginBottom: "0.75rem" });

const errStyle = { fontFamily: "'Outfit',sans-serif", fontSize: "0.72rem", color: C.coral, marginTop: "0.3rem", paddingLeft: "0.2rem" };

/* ════ TRACK CHIP ════ */
function TrackChip({ label, icon, selected, onClick, sm }) {
    const [hov, setHov] = useState(false);
    return (
        <button type="button" aria-pressed={selected} onClick={onClick}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                display: "inline-flex", alignItems: "center", gap: "0.38rem",
                padding: sm ? "0.45rem 0.8rem" : "0.52rem 1rem", borderRadius: 50,
                border: `1.5px solid ${selected ? C.coral : hov ? "rgba(255, 0, 107,0.4)" : "#EAE4D8"}`,
                background: selected ? "rgba(255, 0, 107,0.07)" : hov ? "rgba(255, 0, 107,0.04)" : "#fff",
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: sm ? "0.68rem" : "0.72rem",
                color: selected || hov ? C.coral : C.inkSoft,
                cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.03em",
                boxShadow: selected ? "0 0 0 3px rgba(255, 0, 107,0.1)" : "none",
            }}>
            <span aria-hidden="true" style={{ fontSize: "0.82rem" }}>{icon}</span>{label}
            {selected && <span aria-hidden="true" style={{ fontSize: "0.7rem" }}>✓</span>}
        </button>
    );
}

/* ════ RESUME PICKER ════ */
function ResumePicker({ file, error, onPick, onClear, sm }) {
    const inputRef = useRef(null);
    const [drag, setDrag] = useState(false);
    const [focused, setFocused] = useState(false);
    const id = useId();
    const take = (f) => { if (f) onPick(f); if (inputRef.current) inputRef.current.value = ""; };
    const border = error ? C.coral : drag || focused ? C.coral : file ? "rgba(255, 0, 107,0.35)" : "#D9D1C2";

    return (
        <div data-field="resume">
            <div style={{
                fontFamily: "'Syne',sans-serif", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: error ? C.coral : C.inkSoft, marginBottom: "0.5rem",
            }}>Resume <span style={{ color: C.coral }}>*</span></div>

            {file ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", background: "#fff", border: `1.5px solid ${border}`, borderRadius: 12, padding: "0.8rem 1rem" }}>
                    <div aria-hidden="true" style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255, 0, 107,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>📄</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: "0.85rem", color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.72rem", color: C.inkSoft }}>{formatSize(file.size)}</div>
                    </div>
                    <button type="button" onClick={onClear} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.7rem", color: C.coral, background: "rgba(255, 0, 107,0.07)", border: "none", borderRadius: 50, padding: "0.4rem 0.85rem", cursor: "pointer", flexShrink: 0 }}>Remove</button>
                </div>
            ) : (
                <label htmlFor={id}
                    onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]); }}
                    style={{
                        position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                        textAlign: "center", padding: sm ? "1.2rem 1rem" : "1.5rem 1.2rem", cursor: "pointer",
                        background: drag ? "rgba(255, 0, 107,0.05)" : "#fff", border: `1.5px dashed ${border}`, borderRadius: 12,
                        transition: "all 0.2s", boxShadow: focused ? "0 0 0 3px rgba(255, 0, 107,0.1)" : "none",
                    }}>
                    <span aria-hidden="true" style={{ fontSize: "1.4rem" }}>📎</span>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: C.ink }}>
                        {sm ? "Tap to upload your resume" : "Drop your resume here, or click to browse"}
                    </span>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.72rem", color: C.inkSoft }}>PDF, DOC or DOCX · up to 3 MB</span>
                    <input ref={inputRef} id={id} type="file" accept={RESUME_ACCEPT}
                        onChange={(e) => take(e.target.files?.[0])}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        aria-invalid={error ? true : undefined}
                        style={{ position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden" }} />
                </label>
            )}
            {error && <div role="alert" style={errStyle}>{error}</div>}
        </div>
    );
}

/* ════ SIDE FACT ════ */
function Fact({ children }) {
    return (
        <li style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start", fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", lineHeight: 1.6, color: "rgba(247,243,236,0.88)" }}>
            <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255, 0, 107,0.18)", color: C.coralSoft, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", flexShrink: 0, marginTop: 2 }}>✓</span>
            <span>{children}</span>
        </li>
    );
}

/* ════ MAIN PAGE ════ */
const EMPTY_FORM = { name: "", phone: "", email: "", city: "", state: "", stateOther: "", college: "", course: "", skills: "", link: "", message: "" };

export default function CareersPage() {
    const width = useWindowWidth();
    const sm = width <= 640;
    const md = width > 640 && width <= 1023;
    const twoCol = !sm && !md;

    const [form, setForm] = useState(EMPTY_FORM);
    const [tracks, setTracks] = useState([]);
    const [resume, setResume] = useState(null);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | sending | done
    const [submitError, setSubmitError] = useState("");
    const [honey, setHoney] = useState("");
    const [hovBtn, setHovBtn] = useState(false);
    const [waBusy, setWaBusy] = useState(false);
    const formTop = useRef(null);

    const set = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
    };
    const pickState = (label) => {
        setForm((f) => ({ ...f, state: label, stateOther: label === "Other" ? f.stateOther : "" }));
        setErrors((er) => ({ ...er, state: undefined, stateOther: undefined }));
    };
    const toggleTrack = (label) => {
        setTracks((t) => (t.includes(label) ? t.filter((x) => x !== label) : [...t, label]));
        setErrors((er) => ({ ...er, tracks: undefined }));
    };
    const pickResume = (file) => {
        const msg = checkResume(file);
        if (msg) { setResume(null); setErrors((er) => ({ ...er, resume: msg })); return; }
        setResume(file);
        setErrors((er) => ({ ...er, resume: undefined }));
    };

    const applyForTrack = (label) => {
        setTracks((t) => (t.includes(label) ? t : [...t, label]));
        setErrors((er) => ({ ...er, tracks: undefined }));
        scrollToId("apply-form");
    };

    /* Shows the field errors and scrolls to the first one. Returns true if the form is valid. */
    const checkForm = (opts) => {
        const e = validateApplication(form, tracks, resume, opts);
        setErrors(e);
        const first = ["name", "phone", "email", "city", "state", "stateOther", "tracks", "resume"].find((k) => e[k]);
        if (first) document.querySelector(`[data-field="${first}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
        return !first;
    };

    /* Option 2: open WhatsApp with the details prefilled; the applicant only has to press send.
       If a resume is attached it is uploaded first and the message carries a link to it (a WhatsApp link can't carry a file). */
    const handleWhatsApp = async () => {
        if (status === "sending" || waBusy || !checkForm({ requireResume: false })) return;
        if (!resume) {
            window.open(buildWhatsAppUrl(WA_NUMBER, form, tracks), "_blank", "noopener,noreferrer");
            return;
        }
        const tab = window.open("", "_blank"); // opened inside the click so browsers don't block it; filled in after the upload
        setWaBusy(true);
        const link = await uploadResume({ name: form.name, resume });
        setWaBusy(false);
        const target = buildWhatsAppUrl(WA_NUMBER, form, tracks, link);
        if (tab) { tab.opener = null; tab.location.href = target; } else window.location.href = target;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (status === "sending") return;
        if (!checkForm()) return;
        setStatus("sending");
        setSubmitError("");
        try {
            await submitApplication({ form, tracks, resume, website: honey });
            setStatus("done");
        } catch (err) {
            setSubmitError(err.message);
            setStatus("idle");
        }
    };

    useEffect(() => {
        if (status === "done") formTop.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, [status]);

    const resetForm = () => {
        setForm(EMPTY_FORM); setTracks([]); setResume(null); setErrors({}); setSubmitError(""); setHoney(""); setStatus("idle");
    };

    const heroPad = sm ? "1.8rem 4% 2.2rem" : md ? "2.8rem 4%" : "clamp(3rem,6vw,5rem) 5%";
    const sectionPad = sm ? "2.2rem 4% 2.4rem" : md ? "3rem 4%" : "clamp(3rem,5vw,4.5rem) 5%";
    const h2Size = sm ? "clamp(1.6rem,6.5vw,2rem)" : "clamp(1.9rem,3.5vw,2.8rem)";
    const sending = status === "sending";
    const row2 = { display: "grid", gridTemplateColumns: sm ? "1fr" : "1fr 1fr", gap: "0.85rem" };
    const firstName = form.name.trim().split(/\s+/)[0];

    return (
        <div className="careers-page" style={{ width: "100%", minWidth: 0, paddingTop: 70, fontFamily: "'Outfit',sans-serif" }}>
            <style>{`
                @keyframes careersSpin { to { transform: rotate(360deg); } }
                /* The site's global CSS sets overflow-x:hidden on html, body and #root. That makes each of them a scroll
                   container, which silently breaks position:sticky (the side panel next to the form). While this page is
                   open, switch them to "clip": same visual result (no sideways scrolling) but not a scroll container.
                   This <style> only exists while the Careers page is mounted, so other pages are untouched. */
                @supports (overflow: clip) { html, body, #root { overflow-x: clip !important; } }
                .careers-page { overflow-x: hidden; overflow-x: clip; }
                .careers-btn:focus-visible, .careers-card-btn:focus-visible, .careers-link:focus-visible { outline: 3px solid rgba(255, 0, 107,0.45); outline-offset: 3px; }
                @media (prefers-reduced-motion: reduce) { .careers-spin { animation-duration: 2s !important; } }
                /* same rule as the Contact page: 16px inputs on phones (stops iOS zooming in on focus) */
                @media (max-width: 640px) { input[type], textarea, select { font-size: 16px !important; } }
            `}</style>

            {/* ══ HERO ══ */}
            <section style={{
                background: C.purpleDark, padding: heroPad, position: "relative", overflow: "hidden",
                minHeight: sm ? 260 : md ? 320 : 380,
                backgroundImage: "radial-gradient(circle at 75% 25%, rgba(255, 0, 107,0.14), transparent 50%), radial-gradient(circle at 5% 85%, rgba(90, 157, 254,0.22), transparent 50%)",
            }}>
                {twoCol && (
                    <div aria-hidden="true" style={{
                        fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(4rem,12vw,10rem)", color: "rgba(90,157,254,0.1)", lineHeight: 1,
                        userSelect: "none", pointerEvents: "none", position: "absolute", top: "50%", right: "-1rem",
                        transform: "translateY(-50%)", whiteSpace: "nowrap", zIndex: 1,
                    }}>CAREERS</div>
                )}
                <div style={{ position: "relative", zIndex: 2, maxWidth: 700 }}>
                    <Reveal><STag light>Careers</STag></Reveal>
                    <Reveal delay={0.06}>
                        <h1 style={{
                            fontFamily: "'Bebas Neue',sans-serif", margin: 0, color: C.cream, fontWeight: 400,
                            fontSize: sm ? "clamp(1.9rem,8.5vw,2.7rem)" : md ? "clamp(2.6rem,6vw,4rem)" : "clamp(3rem,5.5vw,5.5rem)",
                            lineHeight: sm ? 1.08 : 0.95,
                        }}>
                            FREE INTERNSHIP<br />ON REAL PROJECTS<br /><span style={{ color: C.coral }}>AT GUGULOTRE.</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.12}>
                        <p style={{ color: "rgba(247,243,236,0.7)", fontSize: FS.heroP(sm), lineHeight: 1.75, maxWidth: 520, margin: sm ? "0.9rem 0 0" : "1.2rem 0 0" }}>
                            Join the Gugulotre team, work on real-time client projects, and finish with a certificate. Pick the domain you like below and apply with your resume.
                        </p>
                    </Reveal>
                    <Reveal delay={0.18}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem", marginTop: sm ? "1.2rem" : "1.6rem" }}>
                            <button type="button" className="careers-btn" onClick={() => scrollToId("apply-form")} style={{
                                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: FS.btn(sm), background: C.coral, color: "#fff", border: "none",
                                padding: "0.8rem 1.7rem", borderRadius: 50, cursor: "pointer", boxShadow: "0 6px 22px rgba(255, 0, 107,0.35)", width: sm ? "100%" : "auto",
                            }}>Apply for the internship</button>
                            <button type="button" className="careers-btn" onClick={() => scrollToId("careers-tracks")} style={{
                                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: FS.btn(sm), background: "transparent", color: C.cream,
                                border: "1.5px solid rgba(247,243,236,0.3)", padding: "0.8rem 1.7rem", borderRadius: 50, cursor: "pointer", width: sm ? "100%" : "auto",
                            }}>See the domains</button>
                        </div>
                    </Reveal>
                </div>
            </section>

            <Marquee items={MQ} />

            {/* ══ WHAT THE INTERNSHIP INCLUDES ══ */}
            <section style={{ background: C.cream, padding: sectionPad }}>
                <div style={{ maxWidth: 1360, margin: "0 auto" }}>
                    <Reveal>
                        <STag>The internship</STag>
                        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: h2Size, color: C.ink, lineHeight: 0.95, margin: "0 0 1.4rem" }}>
                            FREE TO JOIN.<br /><span style={{ color: C.coral }}>REAL WORK TO SHOW.</span>
                        </h2>
                    </Reveal>
                    <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : md ? "1fr 1fr" : "repeat(3, 1fr)", gap: sm ? "0.8rem" : "1.1rem" }}>
                        {PERKS.map((p, i) => (
                            <Reveal key={p.title} delay={i * 0.07}>
                                <div style={{ background: "#fff", border: "1.5px solid #EAE4D8", borderRadius: 16, padding: sm ? "1.2rem" : "1.6rem", height: "100%" }}>
                                    <div aria-hidden="true" style={{ width: 46, height: 46, borderRadius: 12, background: p.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: "0.9rem" }}>{p.icon}</div>
                                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: FS.cardTitle(sm), lineHeight: 1.3, letterSpacing: "0.005em", color: C.ink, margin: "0 0 0.4rem" }}>{p.title}</h3>
                                    <p style={{ fontSize: FS.cardBody(sm), lineHeight: 1.7, color: C.inkSoft, margin: 0 }}>{p.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TRACKS = OUR SERVICES ══ */}
            <section id="careers-tracks" style={{ background: C.purpleDark, padding: sectionPad, scrollMarginTop: 70 }}>
                <div style={{ maxWidth: 1360, margin: "0 auto" }}>
                    <Reveal>
                        <STag light>Domains</STag>
                        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: h2Size, color: C.cream, lineHeight: 0.95, margin: "0 0 0.8rem" }}>
                            SEVEN SERVICES. <span style={{ color: C.coral }}>PICK YOUR DOMAIN.</span>
                        </h2>
                        <p style={{ color: "rgba(247,243,236,0.7)", fontSize: FS.sectionP(sm), lineHeight: 1.75, maxWidth: 560, margin: "0 0 1.6rem" }}>
                            Every domain below is a service we deliver to clients today. Choose the one you want to grow in — you can pick more than one when you apply.
                        </p>
                    </Reveal>
                    <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : md ? "1fr 1fr" : "repeat(3, 1fr)", gap: sm ? "0.8rem" : "1.1rem" }}>
                        {TRACKS.map((t, i) => (
                            <Reveal key={t.label} delay={(i % 3) * 0.07} style={{ gridColumn: (twoCol && t.wide) || (md && i === TRACKS.length - 1 && TRACKS.length % 2 === 1) ? "1 / -1" : "auto" }}>
                                <div style={{
                                    position: "relative", height: "100%", display: "flex", flexDirection: "column",
                                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
                                    padding: sm ? "1.3rem 1.2rem 1.2rem" : "1.6rem 1.5rem 1.4rem", overflow: "hidden",
                                }}>
                                    <span aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.color }} />
                                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: FS.cardTitle(sm), lineHeight: 1.3, letterSpacing: "0.005em", color: "#E8F0FF", margin: "0 0 0.55rem", display: "flex", alignItems: "center", gap: "0.55rem" }}>
                                        <span aria-hidden="true">{t.icon}</span>{t.label}
                                    </h3>
                                    <p style={{ fontSize: FS.cardBody(sm), lineHeight: 1.7, color: "rgba(232,240,255,0.75)", margin: "0 0 1rem", maxWidth: t.wide && twoCol ? 760 : "none" }}>{t.desc}</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.2rem" }}>
                                        {t.tools.map((tool) => (
                                            <span key={tool} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: FS.pill, color: "rgba(232,240,255,0.85)", background: "rgba(255,255,255,0.07)", border: `1px solid ${t.color}66`, borderRadius: 50, padding: "0.25rem 0.65rem" }}>{tool}</span>
                                        ))}
                                    </div>
                                    <button type="button" className="careers-card-btn" onClick={() => applyForTrack(t.label)} style={{
                                        marginTop: "auto", alignSelf: "flex-start", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: FS.btnSm,
                                        color: "#fff", background: "transparent", border: `1.5px solid ${t.color}`, borderRadius: 50, padding: "0.5rem 1.1rem", cursor: "pointer",
                                    }}>{tracks.includes(t.label) ? "Selected ✓ — go to form" : "Apply for this domain"}</button>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ APPLY ══ */}
            <section id="apply-form" style={{ background: C.cream, padding: sectionPad, scrollMarginTop: 70 }}>
                <div style={{
                    display: "grid", gridTemplateColumns: twoCol ? "1.3fr 1fr" : "1fr", gap: sm ? "1.5rem" : md ? "2rem" : "clamp(2.5rem,4vw,4rem)",
                    alignItems: "start", maxWidth: 1360, margin: "0 auto",
                }}>
                    {/* ── Form ── */}
                    <div ref={formTop} style={{ scrollMarginTop: 90, minWidth: 0 }}>
                        <Reveal>
                            <STag>Apply</STag>
                            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: h2Size, color: C.ink, lineHeight: 0.95, margin: "0 0 1.3rem" }}>
                                TELL US ABOUT<br /><span style={{ color: C.coral }}>YOURSELF.</span>
                            </h2>
                        </Reveal>

                        {status === "done" ? (
                            <div role="status" style={{ background: "#fff", border: "1.5px solid rgba(37,211,102,0.35)", borderRadius: 16, padding: sm ? "1.8rem 1.2rem" : "2.5rem 2rem", textAlign: "center", boxShadow: "0 6px 32px rgba(37,211,102,0.1)" }}>
                                <div aria-hidden="true" style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(37,211,102,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", margin: "0 auto 1rem" }}>✅</div>
                                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: sm ? "1.7rem" : "2.2rem", color: C.ink, lineHeight: 1, marginBottom: "0.6rem" }}>APPLICATION SENT!</div>
                                <p style={{ color: C.inkSoft, fontSize: "0.85rem", lineHeight: 1.8, maxWidth: 360, margin: "0 auto" }}>
                                    Thanks{firstName ? `, ${firstName}` : ""}. Your details and resume have reached our team. We'll contact you on the phone number or email you gave us.
                                </p>
                                <button type="button" className="careers-btn" onClick={resetForm} style={{
                                    marginTop: "1.3rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.8rem", background: C.coral, color: "#fff", border: "none",
                                    padding: "0.75rem 1.6rem", borderRadius: 50, cursor: "pointer", boxShadow: "0 5px 18px rgba(255, 0, 107,0.28)", width: sm ? "100%" : "auto",
                                }}>Submit another application</button>
                            </div>
                        ) : (
                            <Reveal delay={0.05}>
                                <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                    <div style={row2}>
                                        <FloatInput label="Full name" name="name" autoComplete="name" required value={form.name} onChange={set("name")} error={errors.name} maxLength={80} />
                                        <FloatInput label="Phone / WhatsApp number" name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={form.phone} onChange={set("phone")} error={errors.phone} maxLength={25} />
                                    </div>
                                    <div style={row2}>
                                        <FloatInput label="Email address" name="email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} error={errors.email} maxLength={120} />
                                        <FloatInput label="City / District" name="city" autoComplete="address-level2" required value={form.city} onChange={set("city")} error={errors.city} maxLength={80} />
                                    </div>

                                    <div data-field="state" style={boxStyle(errors.state, sm)}>
                                        <div style={boxLabelStyle(errors.state)}>Your state <span style={{ color: C.coral }}>*</span></div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                            {STATES.map((st) => <TrackChip key={st} label={st} icon="📍" sm={sm} selected={form.state === st} onClick={() => pickState(st)} />)}
                                        </div>
                                        {form.state === "Other" && (
                                            <div style={{ marginTop: "0.8rem" }}>
                                                <FloatInput label="Which state?" name="stateOther" autoComplete="address-level1" required value={form.stateOther} onChange={set("stateOther")} error={errors.stateOther} maxLength={60} />
                                            </div>
                                        )}
                                        {errors.state && <div role="alert" style={errStyle}>{errors.state}</div>}
                                    </div>

                                    <div style={row2}>
                                        <FloatInput label="College / University (optional)" name="college" autoComplete="organization" value={form.college} onChange={set("college")} maxLength={120} />
                                        <FloatInput label="Course & year (optional)" name="course" value={form.course} onChange={set("course")} maxLength={80} />
                                    </div>

                                    <div data-field="tracks" style={boxStyle(errors.tracks, sm)}>
                                        <div style={boxLabelStyle(errors.tracks)}>
                                            Domain you want to work in <span style={{ color: C.coral }}>*</span>
                                            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: 0, textTransform: "none", marginLeft: "0.55rem", opacity: 0.85, display: "inline-block", whiteSpace: "nowrap" }}>pick one or more</span>
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                            {TRACKS.map((t) => <TrackChip key={t.label} label={t.label} icon={t.icon} sm={sm} selected={tracks.includes(t.label)} onClick={() => toggleTrack(t.label)} />)}
                                        </div>
                                        {errors.tracks && <div role="alert" style={errStyle}>{errors.tracks}</div>}
                                    </div>

                                    <div style={row2}>
                                        <FloatInput label="Skills & tools you know (optional)" name="skills" value={form.skills} onChange={set("skills")} maxLength={300} />
                                        <FloatInput label="Portfolio / GitHub / LinkedIn (optional)" name="link" type="url" autoComplete="url" value={form.link} onChange={set("link")} maxLength={200} />
                                    </div>
                                    <FloatInput label="Why do you want to join? (optional)" name="message" multiline rows={sm ? 4 : 3} value={form.message} onChange={set("message")} maxLength={600} />

                                    <ResumePicker file={resume} error={errors.resume} onPick={pickResume} onClear={() => setResume(null)} sm={sm} />

                                    {/* honeypot: hidden from people, bots fill it */}
                                    <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
                                        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} /></label>
                                    </div>

                                    {submitError && (
                                        <div role="alert" style={{ background: "rgba(255, 0, 107,0.06)", border: "1.5px solid rgba(255, 0, 107,0.3)", borderRadius: 12, padding: "0.8rem 1rem", fontSize: "0.85rem", lineHeight: 1.6, color: C.ink }}>
                                            {submitError}{" "}
                                            <a className="careers-link" href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ color: C.coral, fontWeight: 600 }}>Or message us on WhatsApp</a>
                                        </div>
                                    )}

                                    <div style={{ display: "flex", flexDirection: sm ? "column" : "row", flexWrap: "wrap", gap: "0.7rem", alignItems: sm ? "stretch" : "flex-start" }}>
                                        <button type="submit" className="careers-btn" disabled={sending}
                                            onMouseEnter={() => setHovBtn(true)} onMouseLeave={() => setHovBtn(false)}
                                            style={{
                                                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                                                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: FS.btn(sm), color: "#fff", border: "none",
                                                background: sending ? "rgba(255, 0, 107,0.6)" : hovBtn ? C.coralSoft : C.coral,
                                                padding: "0.95rem 1.8rem", borderRadius: 50, cursor: sending ? "progress" : "pointer",
                                                boxShadow: "0 6px 22px rgba(255, 0, 107,0.3)", width: sm ? "100%" : "auto", alignSelf: sm ? "stretch" : "flex-start",
                                                transform: hovBtn && !sending ? "translateY(-1px)" : "none", transition: "all 0.2s",
                                            }}>
                                            {sending && <span className="careers-spin" aria-hidden="true" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "careersSpin 0.8s linear infinite" }} />}
                                            {sending ? "Sending your application…" : "Submit application"}
                                        </button>
                                        <button type="button" className="careers-btn" onClick={handleWhatsApp} disabled={sending || waBusy}
                                            style={{
                                                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                                                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: FS.btn(sm), color: "#128C4A", background: "#fff",
                                                border: "1.5px solid rgba(37,211,102,0.6)", padding: "0.95rem 1.8rem", borderRadius: 50,
                                                cursor: "pointer", width: sm ? "100%" : "auto",
                                            }}>
                                            {waBusy ? "Preparing WhatsApp…" : "Send on WhatsApp"}
                                        </button>
                                    </div>
                                    <p style={{ fontSize: "0.72rem", lineHeight: 1.6, color: C.inkSoft, margin: 0 }}>
                                        “Submit application” emails your details and resume straight to our team. Prefer WhatsApp? “Send on WhatsApp” opens it with your details already typed (and a link to your resume if you attached one) — just press send. By applying, you agree that we may contact you about this internship.
                                    </p>
                                </form>
                            </Reveal>
                        )}
                    </div>

                    {/* ── Side panel (sticks below the navbar while the form scrolls) ── */}
                    <aside style={{ minWidth: 0, position: twoCol ? "sticky" : "static", top: 90 }}>
                        <Reveal delay={0.1}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div style={{ background: C.purpleDark, borderRadius: 16, padding: sm ? "1.3rem 1.2rem" : "1.5rem 1.6rem", color: C.cream, backgroundImage: "radial-gradient(circle at 90% 8%, rgba(255, 0, 107,0.16), transparent 55%)" }}>
                                    <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: "1.7rem", lineHeight: 1, margin: "0 0 0.9rem", color: C.cream }}>BEFORE YOU APPLY</h3>
                                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                                        <Fact>The internship is free — no fee to apply or join.</Fact>
                                        <Fact>You work on real-time projects with our team.</Fact>
                                        <Fact>You get a certificate when you complete it.</Fact>
                                    </ul>
                                </div>

                                <div style={{ background: "#fff", border: "1.5px solid #EAE4D8", borderRadius: 16, padding: sm ? "1.3rem 1.2rem" : "1.5rem 1.6rem" }}>
                                    <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: "1.7rem", lineHeight: 1, margin: "0 0 0.9rem", color: C.ink }}>HOW IT WORKS</h3>
                                    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                        {[
                                            ["Fill in the form", "Tell us about yourself and pick the domain you want to work in."],
                                            ["Attach your resume", "PDF, DOC or DOCX, up to 3 MB."],
                                            ["We review and get back", "Our team reviews every application and contacts you on the phone number or email you gave."],
                                        ].map(([title, text], i) => (
                                            <li key={title} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                                                <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255, 0, 107,0.1)", color: C.coral, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.72rem", flexShrink: 0 }}>{i + 1}</span>
                                                <span>
                                                    <span style={{ display: "block", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem", color: C.ink, marginBottom: 2 }}>{title}</span>
                                                    <span style={{ display: "block", fontSize: "0.8rem", lineHeight: 1.6, color: C.inkSoft }}>{text}</span>
                                                </span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                <div style={{ background: "#fff", border: "1.5px solid #EAE4D8", borderRadius: 16, padding: sm ? "1.1rem 1.2rem" : "1.2rem 1.6rem" }}>
                                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem", color: C.ink, marginBottom: "0.5rem" }}>Questions first?</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.85rem" }}>
                                        <a className="careers-link" href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ color: "#128C4A", textDecoration: "none", fontWeight: 600 }}>WhatsApp +91 93922 81448</a>
                                        <a className="careers-link" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Internship enquiry")}`} style={{ color: C.inkSoft, textDecoration: "none", wordBreak: "break-word" }}>{EMAIL}</a>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </aside>
                </div>
            </section>
        </div>
    );
}