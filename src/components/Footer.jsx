// src/components/Footer.jsx
import { useState, useEffect } from "react";

const C = {
    purple: "#2F3490",
    purpleDark: "#160B2E",
    orange: "#FF006B",
    orangeSoft: "#FF4D8F",
    lavender: "#DCD2FF",
};
/* ── smart email link: Gmail compose on desktop, mailto on mobile ── */
function smartMailLink(email, subject = "") {
    const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    return isMobile
        ? `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`
        : `https://mail.google.com/mail/?view=cm&to=${email}${subject ? `&su=${encodeURIComponent(subject)}` : ""}`;
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');

@keyframes breathe {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.45; transform:scale(0.75); }
}
@keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
}

.ftr-col { animation: fadeUp 0.52s ease both; }
.ftr-col:nth-child(1) { animation-delay:0.04s; }
.ftr-col:nth-child(2) { animation-delay:0.12s; }
.ftr-col:nth-child(3) { animation-delay:0.20s; }
.ftr-col:nth-child(4) { animation-delay:0.28s; }

/* ── Footer main grid ── */
.ftr-main-grid {
    display: grid;
    grid-template-columns: 2fr 1.1fr 1.1fr 1.5fr;
    gap: 4rem;
    align-items: start;
    padding: 4.5rem 6% 3.5rem;
    position: relative;
    z-index: 2;
}

/* ── Bottom bar ── */
.ftr-bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    padding: 1.4rem 6%;
    position: relative;
    z-index: 2;
    flex-wrap: wrap;
}

/* ── Laptop: 1024–1279px ── */
@media (max-width: 1279px) {
    .ftr-main-grid {
        grid-template-columns: 1.8fr 1fr 1fr 1.4fr;
        gap: 3rem;
    }
}

/* ── Tablet: 768–1023px ── */
@media (min-width: 768px) and (max-width: 1023px) {
    .ftr-main-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2.8rem 2.5rem;
        padding: 3.5rem 6% 2.5rem;
    }
    .ftr-brand-col {
        grid-column: 1 / -1;
    }
}

/* ── Mobile: max 767px ── */
@media (max-width: 767px) {
    .ftr-main-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2.4rem 1.6rem;
        padding: 3rem 5% 2rem;
    }
    .ftr-brand-col {
        grid-column: 1 / -1;
    }
    .ftr-contact-col {
        grid-column: 1 / -1;
    }
    .ftr-bottom {
        flex-direction: column;
        align-items: flex-start;
        padding: 1.2rem 5% 1.8rem;
        gap: 0.9rem;
    }
}

/* ── Small mobile: max 479px ── */
@media (max-width: 479px) {
    .ftr-main-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 2.5rem 5% 2rem;
    }
    .ftr-brand-col,
    .ftr-contact-col {
        grid-column: auto;
    }
}
`;

function injectStyles() {
    if (typeof document === "undefined") return;
    if (document.getElementById("qg-footer-a2")) return;
    const s = document.createElement("style");
    s.id = "qg-footer-a2";
    s.textContent = STYLES;
    document.head.appendChild(s);
}

function SectionLabel({ children }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.4rem" }}>
            <span style={{
                display: "inline-block", width: 16, height: 2,
                background: C.orange, borderRadius: 2, flexShrink: 0,
            }} />
            <span style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: "0.72rem", letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.85)",
            }}>
                {children}
            </span>
        </div>
    );
}

function NavLink({ label, onClick, accent = false }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={onClick}
            style={{
                background: "none", border: "none", padding: "0.32rem 0",
                cursor: "pointer", // FIX: was "none"
                textAlign: "left",
                display: "flex", alignItems: "center", gap: "0.45rem",
                fontFamily: "'Outfit', sans-serif", fontWeight: 400,
                fontSize: "0.9rem",
                color: hov
                    ? accent ? C.orange : "#fff"
                    : accent ? C.orangeSoft : "rgba(220,210,255,0.88)",
                transition: "color 0.2s, transform 0.2s",
                transform: hov ? "translateX(5px)" : "translateX(0)",
                lineHeight: 1.5,
            }}
        >
            {hov && <span style={{ color: C.orange, fontSize: "0.65rem", flexShrink: 0 }}>▸</span>}
            {label}
        </button>
    );
}

const SOCIAL_ICONS = {
    instagram: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    ),
    linkedin: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    facebook: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    pinterest: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
    ),
    email: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
    ),
    whatsapp: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
    location: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
    ),
};
const ICON_COLORS = {
    email: "#EA4335",  // Gmail red
    whatsapp: "#25D366",  // WhatsApp green
    location: "#5A9DFE",  // brand light blue
};

function SocialCircle({ platform, href, color }) {
    const [hov, setHov] = useState(false);
    return (
        <a
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: 40, height: 40, borderRadius: "50%",
                border: `1.5px solid ${hov ? color : "rgba(220,210,255,0.22)"}`,
                background: hov ? `${color}22` : "rgba(255,255,255,0.06)",
                color: hov ? color : "rgba(220,210,255,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none", flexShrink: 0,
                transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                transform: hov ? "translateY(-4px) scale(1.1)" : "none",
                boxShadow: hov ? `0 8px 20px ${color}44` : "none",
            }}
        >
            {SOCIAL_ICONS[platform]}
        </a>
    );
}

function ContactRow({ iconKey, label, value, href }) {
    const [hov, setHov] = useState(false);
    const Tag = href ? "a" : "div";
    return (
        <Tag
            href={href}
            target={href && !href.startsWith("mailto:") ? "_blank" : undefined}
            rel="noopener noreferrer"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                textDecoration: "none", padding: "0.48rem 0.6rem",
                borderRadius: 10,
                background: hov ? "rgba(255,0,107,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${hov ? "rgba(255,0,107,0.28)" : "rgba(220,210,255,0.07)"}`,
                transition: "all 0.22s",
                cursor: href ? "pointer" : "default", // FIX: was "none"
            }}
        >
            <span style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: "rgba(255,0,107,0.16)",
                border: "1px solid rgba(255,0,107,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: ICON_COLORS[iconKey] || "#fff",   // ← brand color always
                transition: "transform 0.22s",
                transform: hov ? "scale(1.08)" : "none",
            }}>{SOCIAL_ICONS[iconKey]}</span>
            <div style={{ minWidth: 0 }}>
                <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: "0.54rem",
                    fontWeight: 700, letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    color: "rgba(150,190,255,0.85)", marginBottom: "0.12rem",
                }}>{label}</div>
                <div style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem",
                    fontWeight: 400,
                    color: hov ? "#fff" : "#fff",
                    transition: "color 0.2s",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{value}</div>
            </div>
        </Tag>
    );
}

// FIX: Rewrote WaButton — the <a> tag had completely malformed JSX
// (raw object-literal style props, broken event handler syntax, and `</a >` closing tag)
function WaButton({ href }) {
    const [hov, setHov] = useState(false);
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.6rem 1.3rem", borderRadius: 50,
                border: `1.5px solid ${hov ? "rgba(37,211,102,0.65)" : "rgba(37,211,102,0.32)"}`,
                background: hov ? "rgba(37,211,102,0.16)" : "rgba(37,211,102,0.08)",
                color: "#25D366",
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: "0.7rem", letterSpacing: "0.05em",
                textDecoration: "none", transition: "all 0.22s",
                transform: hov ? "translateY(-2px)" : "none",
                boxShadow: hov ? "0 6px 20px rgba(37,211,102,0.2)" : "none",
                width: "fit-content",
                cursor: "pointer",
            }}
        >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
        </a>
    );
}

export default function Footer({ setPage, goToService }) {
    injectStyles();

    const go = (page) => {
        setPage(page);
        window.scrollTo({ top: 0, behavior: "instant" });
    };

    const SERVICES = [
        { label: "Web Development", id: "web" },
        { label: "UI / UX Design", id: "uiux" },
        { label: "App Development", id: "app" },
        { label: "E-Commerce Stores", id: "ecom" },
        { label: "WordPress & CMS", id: "wp" },
        { label: "Graphic Design", id: "gd" },
    ];

    const COMPANY = [
        { label: "Home", page: "Home" },
        { label: "About Us", page: "About" },
        { label: "Our Services", page: "Services" },
        { label: "Our Process", page: "Process" },
        { label: "Contact", page: "Contact" },
    ];

    const SOCIALS = [
        { platform: "instagram", href: "https://www.instagram.com/gugulotre/", color: "#E1306C" },
        { platform: "linkedin", href: "https://www.linkedin.com/in/gugulotre/", color: "#0A66C2" },
        { platform: "facebook", href: "https://www.facebook.com/Gugulotre/", color: "#1877F2" },
        { platform: "pinterest", href: "https://www.pinterest.com/gugulotre/", color: "#E60023" },
    ];

    return (
        <footer style={{
            background: C.purpleDark,
            color: C.lavender,
            position: "relative",
            overflow: "hidden",
            border: `3px solid ${C.orange}`,
            borderRadius: 16,
            marginTop: "4px",
        }}>
            {/* Decorative blobs */}
            <div style={{
                position: "absolute", top: -100, right: -60,
                width: 500, height: 500, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,0,107,0.13) 0%, transparent 65%)",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", bottom: -80, left: -60,
                width: 400, height: 400, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(47, 52, 144,0.4) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "radial-gradient(rgba(220,210,255,0.07) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }} />
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: `repeating-linear-gradient(135deg,transparent,transparent 40px,rgba(255,0,107,0.03) 40px,rgba(255,0,107,0.03) 41px)`,
            }} />

            {/* ── Main grid ── */}
            <div className="ftr-main-grid">

                {/* Brand col */}
                <div className="ftr-col ftr-brand-col">
                    {/* Footer — brand button */}
                    <button
                        onClick={() => go("Home")}
                        style={{
                            background: "none", border: "none",
                            cursor: "pointer",
                            display: "inline-flex", alignItems: "center",
                            padding: 0, marginBottom: "1.15rem",
                        }}
                    >
                        <span style={{
                            background: "#fff",
                            borderRadius: 10,
                            padding: "6px 14px",
                            display: "inline-flex", alignItems: "center",
                            boxShadow: "0 0 0 1px rgba(255,255,255,0.15)",
                        }}>
                            <img
                                src="/Gugulotre.png"
                                alt="Gugulotre"
                                height={56}
                                style={{ objectFit: "contain", display: "block" }}
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                        </span>
                    </button>

                    <p style={{
                        fontFamily: "'Outfit', sans-serif", fontWeight: 300,
                        fontSize: "0.9rem", lineHeight: 1.9,
                        color: "rgba(220,210,255,0.88)",
                        maxWidth: 270, marginBottom: "1.8rem",
                    }}>
                        Delivering smart solutions for modern brands — building fast, beautiful, and functional web products.
                    </p>

                    <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
                        {SOCIALS.map(s => <SocialCircle key={s.platform} {...s} />)}
                    </div>
                </div>

                {/* Services col */}
                <div className="ftr-col">
                    <SectionLabel>Services</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {SERVICES.map(s => (
                            <NavLink key={s.id} label={s.label} onClick={() => goToService(s.id)} />
                        ))}
                    </div>
                </div>

                {/* Company col */}
                <div className="ftr-col">
                    <SectionLabel>Company</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {COMPANY.map(l => (
                            <NavLink
                                key={l.page} label={l.label}
                                onClick={() => go(l.page)}
                                accent={l.label === "Contact"}
                            />
                        ))}
                    </div>
                </div>

                {/* Contact col */}
                <div className="ftr-col ftr-contact-col">
                    <SectionLabel>Get In Touch</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1.5rem" }}>
                        <ContactRow iconKey="email" label="Email" value="gugulotre@gmail.com" href={smartMailLink("gugulotre@gmail.com", "Project Enquiry")} />
                        <ContactRow iconKey="whatsapp" label="WhatsApp" value="+91 9392281448" href="https://wa.me/919392281448" />
                        <ContactRow iconKey="location" label="Location" value="SR Nagar, Hyderabad" href={null} />
                    </div>
                    <WaButton href="https://wa.me/919392281448" />
                </div>
            </div>

            {/* Divider */}
            <div style={{
                position: "relative", zIndex: 2, margin: "0 6%", height: 1,
                background: "linear-gradient(90deg, transparent, rgba(220,210,255,0.12) 30%, rgba(255,0,107,0.2) 50%, rgba(220,210,255,0.12) 70%, transparent)",
            }} />

            {/* Bottom bar */}
            <div className="ftr-bottom">
                <p style={{
                    fontFamily: "'Outfit', sans-serif", fontWeight: 300,
                    fontSize: "0.8rem", color: "rgba(220,210,255,0.75)", margin: 0,
                }}>
                    © 2026{new Date().getFullYear() > 2026 ? `–${new Date().getFullYear()}` : ""} Gugulotre. Crafted with care in Hyderabad, India.
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {["Web Development", "UI/UX", "Apps", "E-Commerce", "Graphic Design", "WordPress"].map(tag => (
                        <span key={tag} style={{
                            fontFamily: "'Syne', sans-serif", fontWeight: 700,
                            fontSize: "0.6rem", letterSpacing: "0.1em",
                            color: "rgba(255,140,190,0.85)",
                            background: "rgba(255,0,107,0.1)",
                            border: "1px solid rgba(255,0,107,0.45)",
                            padding: "0.22rem 0.7rem", borderRadius: 50,
                        }}>{tag}</span>
                    ))}
                </div>
            </div>
        </footer>
    );
}