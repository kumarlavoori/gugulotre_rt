import { useState, useEffect, useLayoutEffect, useRef } from "react";

/* ════ THEME ════ */
const C = {
    coral: "#FF006B",
    cream: "#F7F3EC",
    creamDark: "#EDE8DF",
    ink: "#1A1118",
    inkSoft: "#6B5F70",
    purpleDark: "#2D1B4E",
    purple: "#5A9DFE",
    purpleMid: "#3887FD",
};
/* ── smart email link: Gmail compose on desktop, mailto on mobile ── */
function smartMailLink(email, subject = "") {
    const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    return isMobile
        ? `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`
        : `https://mail.google.com/mail/?view=cm&to=${email}${subject ? `&su=${encodeURIComponent(subject)}` : ""}`;
}

const SOCIAL_ICONS = {
    instagram: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    ),
    facebook: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    twitter: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.264 5.633 5.9-5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    linkedin: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    email: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
    ),
    whatsapp: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
    location: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
    ),
};

const ICON_COLORS = {
    email: "#EA4335",
    whatsapp: "#25D366",
    location: "#5A9DFE",
};

const errStyle = {
    fontFamily: "'Outfit',sans-serif",
    fontSize: "0.68rem",
    color: "#FF006B",
    marginTop: "0.28rem",
    paddingLeft: "0.2rem",
};

/* ════ WINDOW WIDTH HOOK ════ */
function useWindowWidth() {
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
    useEffect(() => {
        const h = () => setW(window.innerWidth);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);
    return w;
}

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
            ...style
        }}>
            {children}
        </div>
    );
}

/* ════ SECTION TAG ════ */
function STag({ children, light = false }) {
    return (
        <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: light ? "rgba(247,243,236,0.45)" : C.inkSoft,
            display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.9rem"
        }}>
            <span style={{ width: 18, height: 2, background: C.coral, display: "inline-block", flexShrink: 0 }} />
            {children}
        </div>
    );
}

/* ════ MARQUEE ════ */
function Marquee({ items, coral = false, blue = false }) {
    const tripled = [...items, ...items, ...items];
    return (
        <div style={{ background: coral ? C.coral : blue ? C.purpleMid : C.creamDark, padding: "0.75rem 0", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: "2.5rem", whiteSpace: "nowrap", width: "max-content", animation: "marquee 32s linear infinite" }}>
                {tripled.map((item, i) => (
                    <span key={i} style={{
                        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.7rem",
                        color: (coral || blue) ? "rgba(255,255,255,0.85)" : C.inkSoft,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "0.55rem"
                    }}>
                        {item}
                        <span style={{ color: (coral || blue) ? "rgba(255,255,255,0.4)" : C.coral, fontSize: "0.38rem" }}>●</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ════ FLOATING LABEL INPUT ════ */
function FloatInput({ label, type = "text", value, onChange, required, multiline = false, rows = 4 }) {
    const [focused, setFocused] = useState(false);
    const active = focused || value?.length > 0;
    const base = {
        width: "100%", background: "transparent", border: "none", outline: "none",
        fontFamily: "'Outfit',sans-serif", fontSize: "0.94rem", color: C.ink,
        resize: "none", padding: "1.55rem 1.1rem 0.5rem", boxSizing: "border-box",
    };
    return (
        <div style={{
            position: "relative", background: "#fff",
            border: `1.5px solid ${focused ? C.coral : active ? "rgba(255, 0, 107,0.3)" : "#EAE4D8"}`,
            borderRadius: 12, transition: "border-color 0.25s, box-shadow 0.25s",
            boxShadow: focused ? "0 0 0 3px rgba(255, 0, 107,0.07)" : "none",
        }}>
            <label style={{
                position: "absolute", left: "1.1rem",
                top: active ? "0.4rem" : "50%",
                transform: active ? "none" : (multiline ? "none" : "translateY(-50%)"),
                fontFamily: "'Syne',sans-serif",
                fontSize: active ? "0.59rem" : "0.8rem",
                fontWeight: active ? 700 : 500,
                color: focused ? C.coral : C.inkSoft,
                letterSpacing: active ? "0.1em" : "0.02em",
                textTransform: active ? "uppercase" : "none",
                transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
                pointerEvents: "none", zIndex: 2,
                ...(multiline && !active ? { top: "1rem" } : {}),
            }}>{label}{required && <span style={{ color: C.coral }}> *</span>}</label>
            {multiline ? (
                <textarea rows={rows} value={value} onChange={onChange}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{ ...base, paddingTop: "1.65rem", lineHeight: 1.7 }} />
            ) : (
                <input type={type} value={value} onChange={onChange}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{ ...base, height: 52 }} />
            )}
        </div>
    );
}

/* ════ SERVICE CHIP ════ */
function ServiceChip({ label, icon, selected, onClick, sm }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "inline-flex", alignItems: "center", gap: "0.38rem",
                padding: sm ? "0.42rem 0.8rem" : "0.52rem 1rem",
                borderRadius: 50,
                border: `1.5px solid ${selected ? C.coral : hov ? "rgba(255, 0, 107,0.4)" : "#EAE4D8"}`,
                background: selected ? "rgba(255, 0, 107,0.07)" : hov ? "rgba(255, 0, 107,0.04)" : "#fff",
                fontFamily: "'Syne',sans-serif", fontWeight: 700,
                fontSize: sm ? "0.68rem" : "0.72rem",
                color: selected ? C.coral : hov ? C.coral : C.inkSoft,
                cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.03em",
                boxShadow: selected ? "0 0 0 3px rgba(255, 0, 107,0.1)" : hov ? "0 4px 12px rgba(255, 0, 107,0.1)" : "none",
                transform: hov && !selected ? "translateY(-1px)" : "none",
            }}>
            <span style={{ fontSize: "0.82rem" }}>{icon}</span>{label}
        </button>
    );
}

/* ════ MAP CARD ════ */
function MapCard({ sm }) {
    return (
        <div style={{
            borderRadius: sm ? 12 : 16,
            overflow: "hidden",
            border: "1.5px solid rgba(255,255,255,0.12)",
            boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
        }}>
            <iframe
                title="SR Nagar Hyderabad"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.366564064154!2d78.44017117390729!3d17.442160801227395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb912fe62e71db%3A0xef713c678e4ffbfc!2sGugulotre!5e0!3m2!1sen!2sin!4v1742811711564!5m2!1sen!2sin"
                width="100%" height={sm ? 190 : 250}
                style={{ border: 0, display: "block" }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    );
}

/* ════ INFO CARD ════ */
function InfoCard({ iconKey, label, value, sub, href, sm }) {
    const [hov, setHov] = useState(false);
    const inner = (
        <div
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                background: hov ? "#fff" : "rgba(255,255,255,0.06)",
                border: `1px solid ${hov ? "rgba(255, 0, 107,0.3)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 12,
                padding: sm ? "0.8rem 0.95rem" : "1rem 1.2rem",
                display: "flex", alignItems: "center", gap: "0.75rem",
                transition: "all 0.25s", cursor: href ? "pointer" : "default",
                transform: hov ? "translateY(-2px)" : "none",
                boxShadow: hov ? "0 8px 24px rgba(255, 0, 107,0.12)" : "none",
                textDecoration: "none",
            }}
        >
            <div style={{
                width: sm ? 32 : 36, height: sm ? 32 : 36, borderRadius: 9, flexShrink: 0,
                background: hov ? "rgba(255, 0, 107,0.08)" : "rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: ICON_COLORS[iconKey] || "#fff",
                transition: "background 0.25s, color 0.25s",
            }}>{SOCIAL_ICONS[iconKey]}</div>
            <div style={{ minWidth: 0 }}>
                <div style={{
                    fontFamily: "'Syne',sans-serif", fontSize: "0.56rem", fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: hov ? C.coral : "rgba(247,243,236,0.4)",
                    marginBottom: "0.12rem", transition: "color 0.25s"
                }}>{label}</div>
                <div style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: sm ? "0.8rem" : "0.86rem",
                    fontWeight: 600,
                    color: hov ? C.ink : "rgba(247,243,236,0.9)",
                    transition: "color 0.25s", wordBreak: "break-word",
                }}>{value}</div>
                {sub && <div style={{
                    fontFamily: "'Outfit',sans-serif", fontSize: "0.62rem",
                    color: hov ? C.inkSoft : "rgba(247,243,236,0.4)",
                    marginTop: "0.08rem", transition: "color 0.25s"
                }}>{sub}</div>}
            </div>
        </div>
    );
    return href ? <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" style={{ textDecoration: "none" }}>{inner}</a> : inner;
}

/* ════ SOCIAL BUTTON ════ */
function SocialBtn({ label, iconKey, color, href }) {
    const [hov, setHov] = useState(false);
    return (
        <a href={href || "#"} target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 700,
                fontSize: "0.68rem", letterSpacing: "0.03em",
                background: hov ? color : "#fff",
                border: `1.5px solid ${hov ? color : "#EAE4D8"}`,
                color: hov ? "#fff" : C.inkSoft,
                padding: "0.42rem 0.85rem", borderRadius: 50,
                cursor: "pointer", transition: "all 0.22s",
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                textDecoration: "none",
                transform: hov ? "translateY(-2px)" : "none",
                boxShadow: hov ? `0 5px 14px ${color}55` : "none",
            }}
        >
            <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                color: hov ? "#fff" : color,
                transition: "color 0.22s",
            }}>
                {SOCIAL_ICONS[iconKey]}
            </span>
            {label}
        </a>
    );
}

/* ════ MAIN CONTACT PAGE ════ */
export default function ContactPage({ setPage, targetSection, onSectionHandled }) {
    useLayoutEffect(() => {
        if (!targetSection) return;
        const el = document.getElementById(targetSection);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 30;
            window.scrollTo({ top, behavior: "instant" });
        }
        onSectionHandled?.();
    }, [targetSection]);
    // ... rest unchanged
    const width = useWindowWidth();
    const sm = width <= 640;
    const md = width > 640 && width <= 1023;

    const SERVICES = [
        { label: "Web Development", icon: "🌐" },
        { label: "UI / UX Design", icon: "🎨" },
        { label: "App Development", icon: "📱" },
        { label: "E-Commerce", icon: "🛒" },
        { label: "WordPress & CMS", icon: "⚡" },
        { label: "Graphic Design", icon: "✏️" },
        { label: "Other", icon: "✨" },
    ];

    const SOCIALS = [
        { label: "Instagram", iconKey: "instagram", color: "#E1306C", href: "https://www.instagram.com/gugulotre/" },
        { label: "Facebook", iconKey: "facebook", color: "#1877F2", href: "https://www.facebook.com/Gugulotre/" },
        { label: "Twitter / X", iconKey: "twitter", color: "#000", href: "https://x.com/gugulotre" },
        { label: "LinkedIn", iconKey: "linkedin", color: "#0A66C2", href: "https://www.linkedin.com/in/gugulotre/" },
    ];

    const [form, setForm] = useState({ name: "", phone: "", email: "", company: "", message: "", otherService: "" });
    const [selectedServices, setSelectedServices] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [submittedVia, setSubmittedVia] = useState("");
    // ── FIX: "" = idle, "whatsapp" = WA loading, "gmail" = Gmail loading ──
    const [sending, setSending] = useState("");
    const [errors, setErrors] = useState({});
    const [waHov, setWaHov] = useState(false);
    const [gmHov, setGmHov] = useState(false);
    const [otherFocused, setOtherFocused] = useState(false);

    const toggleService = (i) => setSelectedServices(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = true;
        if (!form.phone.trim()) e.phone = true;
        if (!selectedServices.length) e.services = true;
        return e;
    };

    const buildServiceNames = () =>
        selectedServices.map(i =>
            i === 6 ? `Other: ${form.otherService.trim() || "unspecified"}` : SERVICES[i].label
        ).join(", ");

    /* ── WhatsApp submit ── */
    const handleWhatsAppSubmit = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setSending("whatsapp"); // ← only WA button gets loading state
        const lines = [
            `Hi Gugulotre Team,`,
            `I'd like to discuss a project with you.`,
            ``,
            `Name: ${form.name}`,
            `Phone: ${form.phone}`,
            form.email ? `Email: ${form.email}` : null,
            form.company ? `Company: ${form.company}` : null,
            `Services Needed: ${buildServiceNames()}`,
            form.message ? `Message: ${form.message}` : null,
            ``,
            `Looking forward to hearing from you!`,
        ].filter(Boolean).join("\n");
        const waURL = `https://wa.me/919392281448?text=${encodeURIComponent(lines)}`;
        setTimeout(() => {
            setSending("");
            setSubmittedVia("whatsapp");
            setSubmitted(true);
            window.open(waURL, "_blank");
        }, 900);
    };

    /* ── Gmail submit ── */
    const handleGmailSubmit = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setSending("gmail"); // ← only Gmail button gets loading state
        const subject = `Project Enquiry from ${form.name} — Gugulotre Website`;
        const body = [
            `Hi Gugulotre Team,`,
            ``,
            `I'd like to discuss a project with you.`,
            ``,
            `Name: ${form.name}`,
            `Phone: ${form.phone}`,
            form.email ? `Email: ${form.email}` : null,
            form.company ? `Company: ${form.company}` : null,
            `Services Needed: ${buildServiceNames()}`,
            form.message ? `Message: ${form.message}` : null,
            ``,
            `Looking forward to hearing from you!`,
        ].filter(Boolean).join("\n");
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const gmailURL = isMobile
            ? `mailto:gugulotre@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            : `https://mail.google.com/mail/?view=cm&to=gugulotre@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setTimeout(() => {
            setSending("");
            setSubmittedVia("gmail");
            setSubmitted(true);
            window.open(gmailURL, "_blank");
        }, 900);
    };

    const resetForm = () => {
        setSubmitted(false);
        setSubmittedVia("");
        setForm({ name: "", phone: "", email: "", company: "", message: "", otherService: "" });
        setSelectedServices([]);
    };

    const MQ = ["Let's Talk", "Free Consultation", "Fast Delivery", "No Commitment", "Clean Code", "Pixel Perfect", "In-House Team", "100% Custom"];

    const sectionPad = sm ? "1.8rem 4% 2rem" : md ? "2.5rem 4%" : "clamp(3rem,5vw,4.5rem) 5%";
    const heroPad = sm ? "1.8rem 4% 2.2rem" : md ? "2.8rem 4%" : "clamp(3rem,6vw,5rem) 5%";
    const twoCol = !sm && !md;

    return (
        <div style={{ width: "100%", minWidth: 0, paddingTop: 70, fontFamily: "'Outfit',sans-serif", overflowX: "hidden" }}>
            <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;700;800&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />

            {/* ══ HERO ══ */}
            <section style={{
                background: C.purpleDark, padding: heroPad,
                position: "relative", overflow: "hidden",
                minHeight: sm ? 230 : md ? 290 : 340,
                backgroundImage: "radial-gradient(circle at 75% 25%, rgba(255, 0, 107,0.12), transparent 50%), radial-gradient(circle at 5% 85%, rgba(90, 157, 254,0.2), transparent 50%)",
            }}>
                {twoCol && (
                    <div style={{
                        fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(4rem,12vw,10rem)",
                        color: "rgba(80,40,140,0.28)", lineHeight: 1,
                        userSelect: "none", pointerEvents: "none",
                        position: "absolute", top: "50%", right: "-1rem",
                        transform: "translateY(-50%)", whiteSpace: "nowrap", zIndex: 1,
                    }}>CONTACT</div>
                )}
                <div style={{ position: "relative", zIndex: 2, maxWidth: 660 }}>
                    <Reveal><STag light>Get In Touch</STag></Reveal>
                    <Reveal delay={0.06}>
                        <h1 style={{
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: sm ? "clamp(1.9rem,8.5vw,2.7rem)" : md ? "clamp(2.6rem,6vw,4rem)" : "clamp(3rem,5.5vw,5.5rem)",
                            color: C.cream, lineHeight: sm ? 1.08 : 0.95, margin: 0,
                        }}>
                            LET'S BUILD<br />SOMETHING<br /><span style={{ color: C.coral }}>EXTRAORDINARY.</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.12}>
                        <p style={{
                            color: "rgba(247,243,236,0.5)",
                            fontSize: sm ? "0.8rem" : "clamp(0.82rem,1.4vw,0.96rem)",
                            lineHeight: 1.75, maxWidth: 440,
                            marginTop: sm ? "0.9rem" : "1.2rem",
                        }}>
                            Tell us about your project. We'll get back within 24 hours with a clear plan — no fluff, no pushy sales, just real talk about what we can build together.
                        </p>
                    </Reveal>
                </div>
            </section>

            <Marquee items={MQ} blue />

            {/* ══ MAIN CONTENT ══ */}
            <section id="contact-form" style={{ background: C.cream, padding: sectionPad }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: twoCol ? "1.1fr 1fr" : "1fr",
                    gap: sm ? "1.5rem" : md ? "2rem" : "clamp(2.5rem,4vw,4rem)",
                    alignItems: "start", maxWidth: 1360, margin: "0 auto",
                }}>

                    {/* ── LEFT: Form ── */}
                    <div>
                        <Reveal>
                            <STag>Send a Message</STag>
                            <h2 style={{
                                fontFamily: "'Bebas Neue',sans-serif",
                                fontSize: sm ? "clamp(1.6rem,6.5vw,2rem)" : "clamp(1.9rem,3.5vw,2.8rem)",
                                color: C.ink, lineHeight: 0.95, marginBottom: "1.3rem", marginTop: 0,
                            }}>
                                DESCRIBE YOUR<br /><span style={{ color: C.coral }}>PROJECT.</span>
                            </h2>
                        </Reveal>

                        {submitted ? (
                            <Reveal>
                                <div style={{
                                    background: "#fff", border: "1.5px solid rgba(255, 0, 107,0.2)",
                                    borderRadius: 16, padding: sm ? "1.8rem 1.2rem" : "2.5rem 2rem",
                                    textAlign: "center", boxShadow: "0 6px 32px rgba(255, 0, 107,0.08)",
                                }}>
                                    <div style={{
                                        width: 60, height: 60, borderRadius: "50%",
                                        background: submittedVia === "gmail" ? "rgba(234,67,53,0.1)" : "rgba(37,211,102,0.1)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "1.7rem", margin: "0 auto 1rem",
                                        animation: "svcIconFloat 3s ease infinite",
                                    }}>
                                        {submittedVia === "gmail" ? "✉️" : "💬"}
                                    </div>
                                    <div style={{
                                        fontFamily: "'Bebas Neue',sans-serif",
                                        fontSize: sm ? "1.7rem" : "2.2rem",
                                        color: C.ink, lineHeight: 1, marginBottom: "0.6rem",
                                    }}>
                                        {submittedVia === "gmail" ? "OPENING GMAIL!" : "OPENING WHATSAPP!"}
                                    </div>
                                    <p style={{ color: C.inkSoft, fontSize: "0.85rem", lineHeight: 1.8, maxWidth: 320, margin: "0 auto" }}>
                                        {submittedVia === "gmail"
                                            ? "Your email has been pre-filled in Gmail. Review and hit Send!"
                                            : "Your message has been pre-filled in WhatsApp. Just hit send!"}
                                    </p>
                                    <button onClick={resetForm} style={{
                                        marginTop: "1.3rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.8rem",
                                        background: C.coral, color: "#fff", border: "none",
                                        padding: "0.75rem 1.6rem", borderRadius: 50, cursor: "pointer",
                                        boxShadow: "0 5px 18px rgba(255, 0, 107,0.28)",
                                        width: sm ? "100%" : "auto",
                                    }}>Send Another Message</button>
                                </div>
                            </Reveal>
                        ) : (
                            <Reveal delay={0.05}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

                                    {/* Name + Phone */}
                                    <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "1fr 1fr", gap: "0.85rem" }}>
                                        <div>
                                            <FloatInput label="Your Name" value={form.name} required
                                                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(ev => ({ ...ev, name: false })); }} />
                                            {errors.name && <div style={errStyle}>Name is required</div>}
                                        </div>
                                        <div>
                                            <FloatInput label="Phone Number" type="tel" value={form.phone} required
                                                onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(ev => ({ ...ev, phone: false })); }} />
                                            {errors.phone && <div style={errStyle}>Phone number is required</div>}
                                        </div>
                                    </div>

                                    {/* Email + Company */}
                                    <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "1fr 1fr", gap: "0.85rem" }}>
                                        <FloatInput label="Email Address (optional)" type="email" value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                        <FloatInput label="Company / Brand (optional)" value={form.company}
                                            onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                                    </div>

                                    {/* Services */}
                                    <div style={{
                                        background: "#fff", borderRadius: 12,
                                        border: `1.5px solid ${errors.services ? C.coral : "#EAE4D8"}`,
                                        padding: sm ? "0.9rem 0.95rem" : "1.1rem 1.2rem",
                                        transition: "border-color 0.25s",
                                    }}>
                                        <div style={{
                                            fontFamily: "'Syne',sans-serif", fontSize: "0.64rem", fontWeight: 700,
                                            letterSpacing: "0.12em", textTransform: "uppercase",
                                            color: errors.services ? C.coral : C.inkSoft,
                                            marginBottom: "0.75rem",
                                            display: "flex", alignItems: "center", gap: "0.3rem",
                                        }}>
                                            Services Needed <span style={{ color: C.coral }}>*</span>
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                            {SERVICES.map((s, i) => (
                                                <ServiceChip key={s.label} {...s} sm={sm}
                                                    selected={selectedServices.includes(i)}
                                                    onClick={() => { toggleService(i); setErrors(ev => ({ ...ev, services: false })); }} />
                                            ))}
                                        </div>

                                        {/* Other — custom input */}
                                        {selectedServices.includes(6) && (
                                            <div style={{ marginTop: "0.75rem" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Please describe your service requirement..."
                                                    value={form.otherService}
                                                    onChange={e => setForm(f => ({ ...f, otherService: e.target.value }))}
                                                    onFocus={() => setOtherFocused(true)}
                                                    onBlur={() => setOtherFocused(false)}
                                                    style={{
                                                        width: "100%", padding: "0.7rem 1rem",
                                                        fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem",
                                                        color: C.ink, background: C.cream,
                                                        border: `1.5px solid ${otherFocused ? C.coral : "rgba(255, 0, 107,0.25)"}`,
                                                        borderRadius: 10, outline: "none",
                                                        boxSizing: "border-box",
                                                        boxShadow: otherFocused ? "0 0 0 3px rgba(255, 0, 107,0.07)" : "none",
                                                        transition: "border-color 0.22s, box-shadow 0.22s",
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {errors.services && <div style={errStyle}>Please select at least one service</div>}
                                    </div>

                                    <FloatInput label="Tell us about your project (optional)" value={form.message} multiline rows={sm ? 4 : 5}
                                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />

                                    {/* ── Send Buttons ── */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>

                                        {/* ── WhatsApp Button ── */}
                                        <button
                                            onClick={handleWhatsAppSubmit}
                                            disabled={sending !== ""}
                                            onMouseEnter={() => setWaHov(true)}
                                            onMouseLeave={() => setWaHov(false)}
                                            style={{
                                                fontFamily: "'Syne',sans-serif", fontWeight: 700,
                                                fontSize: sm ? "0.8rem" : "0.88rem",
                                                background: sending === "whatsapp" ? "rgba(37,211,102,0.65)" : waHov ? "#20c25a" : "#25D366",
                                                color: "#fff", border: "none",
                                                padding: sm ? "0.95rem 0.6rem" : "1.05rem 0.8rem",
                                                borderRadius: 50,
                                                cursor: sending !== "" ? "not-allowed" : "pointer",
                                                transition: "all 0.25s", width: "100%",
                                                boxShadow: waHov && sending === "" ? "0 8px 28px rgba(37,211,102,0.45)" : "0 5px 18px rgba(37,211,102,0.26)",
                                                transform: waHov && sending === "" ? "translateY(-2px)" : "none",
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem",
                                                letterSpacing: "0.03em",
                                                opacity: sending === "gmail" ? 0.55 : 1, // dim while the OTHER button is loading
                                            }}
                                        >
                                            {sending === "whatsapp" ? (
                                                <span style={{
                                                    width: 14, height: 14, borderRadius: "50%",
                                                    border: "2px solid rgba(255,255,255,0.35)",
                                                    borderTopColor: "#fff", display: "inline-block",
                                                    animation: "spin 0.7s linear infinite",
                                                }} />
                                            ) : (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                            )}
                                            {sending === "whatsapp" ? "Opening..." : "WhatsApp"}
                                        </button>

                                        {/* ── Gmail Button ── */}
                                        <button
                                            onClick={handleGmailSubmit}
                                            disabled={sending !== ""}
                                            onMouseEnter={() => setGmHov(true)}
                                            onMouseLeave={() => setGmHov(false)}
                                            style={{
                                                fontFamily: "'Syne',sans-serif", fontWeight: 700,
                                                fontSize: sm ? "0.8rem" : "0.88rem",
                                                background: sending === "gmail" ? "rgba(30,27,40,0.7)" : gmHov ? "#2d2840" : "#1E1B28",
                                                color: "#fff", border: "none",
                                                padding: sm ? "0.95rem 0.6rem" : "1.05rem 0.8rem",
                                                borderRadius: 50,
                                                cursor: sending !== "" ? "not-allowed" : "pointer",
                                                transition: "all 0.25s", width: "100%",
                                                boxShadow: gmHov && sending === "" ? "0 8px 28px rgba(0,0,0,0.45)" : "0 5px 18px rgba(0,0,0,0.28)",
                                                transform: gmHov && sending === "" ? "translateY(-2px)" : "none",
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem",
                                                letterSpacing: "0.03em",
                                                opacity: sending === "whatsapp" ? 0.55 : 1, // dim while the OTHER button is loading
                                            }}
                                        >
                                            {sending === "gmail" ? (
                                                <span style={{
                                                    width: 14, height: 14, borderRadius: "50%",
                                                    border: "2px solid rgba(255,255,255,0.35)",
                                                    borderTopColor: "#fff", display: "inline-block",
                                                    animation: "spin 0.7s linear infinite",
                                                }} />
                                            ) : (
                                                <svg width="18" height="14" viewBox="0 0 48 36" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill="#4285F4" d="M0 36V8.7L24 26 48 8.7V36z" />
                                                    <path fill="#EA4335" d="M0 8.7L24 26 48 8.7 24 0z" />
                                                    <path fill="#FBBC05" d="M0 8.7V36l7.5-7.5V16.2z" />
                                                    <path fill="#34A853" d="M48 8.7V36l-7.5-7.5V16.2z" />
                                                    <path fill="#4285F4" d="M7.5 28.5V36H0l7.5-7.5zM40.5 28.5V36H48l-7.5-7.5z" />
                                                </svg>
                                            )}
                                            {sending === "gmail" ? "Opening..." : "Send Email"}
                                        </button>
                                    </div>

                                    <p style={{
                                        fontFamily: "'Outfit',sans-serif", fontSize: "0.68rem",
                                        color: C.inkSoft, textAlign: "center", lineHeight: 1.6, margin: 0,
                                    }}>
                                        🔒 Your details are never shared. We reply within 24 hours.
                                    </p>
                                </div>
                            </Reveal>
                        )}
                    </div>

                    {/* ── RIGHT: Info Panel ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                        <Reveal delay={sm ? 0 : 0.1}>
                            <div style={{
                                background: C.purpleDark,
                                borderRadius: sm ? 16 : 20,
                                padding: sm ? "1.4rem 1.1rem" : md ? "1.8rem 1.5rem" : "2rem 1.8rem",
                                position: "relative", overflow: "hidden",
                                backgroundImage: "radial-gradient(circle at 90% 10%, rgba(255, 0, 107,0.1), transparent 50%), radial-gradient(circle at 10% 90%, rgba(90, 157, 254,0.2), transparent 50%)",
                            }}>
                                {twoCol && (
                                    <div style={{
                                        fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(3rem,7vw,6rem)",
                                        color: "rgba(80,40,140,0.28)", lineHeight: 1,
                                        position: "absolute", bottom: "-0.4rem", right: "-0.4rem",
                                        userSelect: "none", pointerEvents: "none",
                                    }}>HI</div>
                                )}
                                <STag light>Reach Us Directly</STag>
                                <h3 style={{
                                    fontFamily: "'Bebas Neue',sans-serif",
                                    fontSize: sm ? "1.5rem" : md ? "1.9rem" : "clamp(1.5rem,2.2vw,2rem)",
                                    color: C.cream, lineHeight: 1.05,
                                    marginBottom: sm ? "1rem" : "1.3rem", marginTop: 0,
                                }}>
                                    WE'RE REAL PEOPLE.<br /><span style={{ color: C.coral }}>LET'S TALK.</span>
                                </h3>
                                <div style={{
                                    display: "flex", flexDirection: "column",
                                    gap: sm ? "0.5rem" : "0.6rem",
                                    position: "relative", zIndex: 1,
                                    marginBottom: sm ? "1rem" : "1.3rem",
                                }}>
                                    <InfoCard iconKey="email" label="Email" value="gugulotre@gmail.com" sub="Reply within 24 hours" href={smartMailLink("gugulotre@gmail.com", "Project Enquiry")} sm={sm} />
                                    <InfoCard iconKey="whatsapp" label="WhatsApp" value="+91 9392281448" sub="Quick chats & project briefs" href="https://wa.me/919392281448" sm={sm} />
                                    <InfoCard iconKey="location" label="Location" value="SR Nagar, Hyderabad" sub="Telangana, India 500038" sm={sm} />
                                </div>
                                <MapCard sm={sm} />
                            </div>
                        </Reveal>

                        {/* Social links */}
                        <Reveal delay={sm ? 0 : 0.14}>
                            <div>
                                <div style={{
                                    fontFamily: "'Syne',sans-serif", fontSize: "0.64rem", fontWeight: 700,
                                    letterSpacing: "0.12em", textTransform: "uppercase",
                                    color: C.inkSoft, marginBottom: "0.75rem",
                                    display: "flex", alignItems: "center", gap: "0.5rem",
                                }}>
                                    <span style={{ width: 16, height: 2, background: C.coral, display: "inline-block" }} />
                                    Follow Us Online
                                </div>
                                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                                    {SOCIALS.map(s => <SocialBtn key={s.label} {...s} />)}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══ CSS ══ */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;700;800&family=Outfit:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes svcIconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; }
        input, textarea, button { font-family: inherit; }
        @media (max-width: 640px) {
          input[type], textarea, select { font-size: 16px !important; }
        }
      `}</style>
        </div>
    );
}