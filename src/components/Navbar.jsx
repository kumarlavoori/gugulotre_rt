// Navbar.jsx
import { useState, useEffect } from "react";
import { C } from "./theme";
import LogoMark from "./LogoMark";
import "./layout.css";

/* Real <a href> links, so Google can follow the menu to every page. A normal click still moves around the site
   without reloading; Ctrl/Cmd-click opens the page in a new tab. */
const hrefOf = (l) => (l === "Home" ? "/" : `/${l.toLowerCase()}`);
const plainClick = (e) => !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0);

function NavLink({ label, href, active, onClick, tight = false }) {
    const [hov, setHov] = useState(false);
    return (
        <a href={href} onClick={(e) => { if (plainClick(e)) { e.preventDefault(); onClick(); } }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: "inline-block", textDecoration: "none", fontFamily: "'Syne',sans-serif", fontSize: "0.83rem", fontWeight: 600, border: "none", cursor: "none", color: active ? "#fff" : hov ? C.coral : C.inkSoft, background: active ? C.coral : hov ? "rgba(255, 0, 107,0.07)" : "transparent", padding: tight ? "0.4rem clamp(0.4rem, calc(1.1vw - 0.2rem), 1rem)" : "0.4rem clamp(0.55rem, 1.1vw, 1rem)", borderRadius: 50, boxShadow: active ? "0 3px 12px rgba(255, 0, 107,0.28)" : "none", transition: "all 0.2s" }}>
            {label}
        </a>
    );
}

export default function Navbar({ page, setPage, goToContactForm }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);

    // ← REMOVED "Pricing"
    const links = ["Home", "About", "Services", "Gallery", "Process", "Careers", "Contact"];

    useEffect(() => {
        const h = () => setWidth(window.innerWidth);
        window.addEventListener("resize", h, { passive: true });
        return () => window.removeEventListener("resize", h);
    }, []);
    useEffect(() => setMenuOpen(false), [page]);

    const isTablet = width >= 768 && width < 1024;
    const isMobile = width < 768;

    return (
        <>
            <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5%", background: "rgba(247,243,236,0.96)", backdropFilter: "blur(20px)", boxShadow: "0 1px 0 #EAE4D8", transition: "background 0.4s" }}>
                <a href="/" aria-label="Gugulotre home" onClick={(e) => { if (plainClick(e)) { e.preventDefault(); setPage("Home"); } }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, flexShrink: 0, textDecoration: "none" }}>
                    <img
                        src="/Gugulotre.png"
                        alt="Gugulotre"
                        height={isMobile ? 50 : 60}
                        style={{ objectFit: "contain", display: "block" }}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                </a>

                <ul className="nav-links">
                    {links.map((l) => (<li key={l}><NavLink label={l} href={hrefOf(l)} tight={width < 1280} active={page === `/${l.toLowerCase()}` || (l === "Home" && page === "/")}
                        onClick={() => setPage(l)} /></li>))}
                </ul>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {width >= 768 && (
                        <button className="nav-cta" onClick={goToContactForm}
                            onMouseEnter={(e) => { e.currentTarget.style.background = C.purpleSoft; e.currentTarget.style.transform = "translateY(-1px)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = C.purple; e.currentTarget.style.transform = ""; }}
                            style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: isTablet ? "0.78rem" : "0.83rem", background: C.purple, color: "#fff", border: "none", cursor: "none", padding: isTablet ? "0.5rem 1rem" : "0.6rem 1.4rem", borderRadius: 50, display: "inline-flex", alignItems: "center", gap: "0.4rem", transition: "all 0.22s", whiteSpace: "nowrap" }}>
                            Start a Project
                        </button>
                    )}
                    {width < 1024 && (
                        <button className="nav-ham" onClick={() => setMenuOpen(v => !v)} style={{ background: "none", border: "none", cursor: "none", display: "flex", flexDirection: "column", gap: 5, padding: 8, borderRadius: 8 }}>
                            {[0, 1, 2].map((i) => {
                                let t = "none";
                                if (menuOpen) { if (i === 0) t = "translateY(7px) rotate(45deg)"; else if (i === 2) t = "translateY(-7px) rotate(-45deg)"; }
                                return <span key={i} style={{ display: "block", width: 22, height: 2, background: C.ink, borderRadius: 2, transition: "all 0.3s", transform: t, opacity: menuOpen && i === 1 ? 0 : 1 }} />;
                            })}
                        </button>
                    )}
                </div>
            </nav>

            {/* ── Mobile menu ── */}
            <div className={`mob-menu${menuOpen ? " open" : ""}`} style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}>
                {/* Nav links */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", paddingTop: "0.4rem" }}>
                    {links.map((l) => (
                        <a key={l} href={hrefOf(l)} onClick={(e) => { if (plainClick(e)) { e.preventDefault(); setPage(l); } }} className={`mob-menu-link${page === `/${l.toLowerCase()}` || (l === "Home" && page === "/") ? " active" : ""}`} style={{ textDecoration: "none" }}
                        >
                            <span>{l}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </a>
                    ))}
                </div>

                {/* CTA — always pinned at bottom */}
                <div className="mob-menu-cta" style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
                    <button onClick={goToContactForm} style={{ width: "100%", padding: "0.9rem 1.5rem", background: C.coral, color: "#fff", border: "none", borderRadius: 50, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "none", boxShadow: "0 6px 22px rgba(255, 0, 107,0.35)" }}>
                        Start a Project →
                    </button>
                    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.72rem", color: "rgba(247,243,236,0.25)", textAlign: "center", marginTop: "1rem" }}>Gugulotre · Based in Hyderabad · gugulotre.com</p>
                </div>
            </div>
        </>
    );
}