import { useState, useEffect, useRef } from "react";
import { C } from "../components/theme";

/* ════════════ BUTTONS ════════════ */
function BtnCoral({ children, onClick, style = {} }) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(0.8rem,1.5vw,0.9rem)", background: hov ? "#5A9DFE" : C.purpleMid, color: "#fff", border: "none", cursor: "none", padding: "0.88rem 1.9rem", borderRadius: 50, boxShadow: hov ? "0 10px 28px rgba(56, 135, 253,0.38)" : "0 4px 18px rgba(56, 135, 253,0.28)", display: "inline-flex", alignItems: "center", gap: "0.5rem", transform: hov ? "translateY(-2px)" : "translateY(0)", transition: "all 0.22s", letterSpacing: "0.02em", whiteSpace: "nowrap", ...style }}>
            {children}
        </button>
    );
}

function BtnGhost({ children, onClick, dark = false, style = {} }) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(0.8rem,1.5vw,0.9rem)", cursor: "none", background: hov ? (dark ? "rgba(255,255,255,0.06)" : "rgba(47, 52, 144,0.05)") : "transparent", color: hov ? (dark ? "#fff" : C.purple) : (dark ? "rgba(247,243,236,0.65)" : C.inkSoft), border: `1.5px solid ${hov ? (dark ? "rgba(255,255,255,0.38)" : C.purple) : (dark ? "rgba(255,255,255,0.18)" : C.creamDark)}`, padding: "0.88rem 1.9rem", borderRadius: 50, display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "all 0.22s", letterSpacing: "0.02em", whiteSpace: "nowrap", ...style }}>
            {children}
        </button>
    );
}

function ViewAllBtn({ children, onClick }) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ background: hov ? C.purple : "none", border: `1.5px solid ${hov ? C.purple : "rgba(47, 52, 144,0.18)"}`, color: hov ? "#fff" : C.purple, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem", padding: "0.6rem 1.5rem", borderRadius: 50, cursor: "none", transition: "all 0.2s" }}>
            {children}
        </button>
    );
}

/* ════════════ SECTION TAG ════════════ */
function STag({ children, light = false, center = false }) {
    return (
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: light ? "rgba(247,243,236,0.45)" : C.inkSoft, display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.1rem", justifyContent: center ? "center" : "flex-start" }}>
            <span style={{ width: 20, height: 2, background: C.coral, display: "inline-block", flexShrink: 0 }} />
            {children}
        </div>
    );
}

/* ════════════ SCROLL REVEAL ════════════ */
function Reveal({ children, delay = 0, style = {} }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`, ...style }}>
            {children}
        </div>
    );
}

/* ════════════ MARQUEE ════════════ */
function Marquee({ items, coral = false, blue = false, dark = false, reverse = false }) {
    const tripled = [...items, ...items, ...items];
    const bg = coral ? C.coral : blue ? C.purpleMid : dark ? C.purpleDark : C.creamDark;
    const itemColor = coral ? "rgba(255,255,255,0.85)" : blue ? "rgba(255,255,255,0.85)" : dark ? "rgba(247,243,236,0.38)" : C.inkSoft;
    const sepColor = coral ? "rgba(255,255,255,0.5)" : blue ? "rgba(255,255,255,0.5)" : C.coral;
    return (
        <div style={{ background: bg, padding: "0.9rem 0", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: "2.5rem", whiteSpace: "nowrap", width: "max-content", animation: `${reverse ? "marqueeRev" : "marquee"} 35s linear infinite` }}>
                {tripled.map((item, i) => (
                    <span key={i} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.78rem", color: itemColor, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
                        {item}<span style={{ color: sepColor, fontSize: "0.48rem" }}>●</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ════════════ SVG ICONS ════════════ */
const Icon = {
    Globe: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    Pen: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
    Phone: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
    Zap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    Cart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
    Build: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="1" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    Target: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
    Flame: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>,
    Refresh: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
    Users: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    Mail: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    ArrowRight: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
    Brush: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.07" /><path d="M7.07 14.94C5.79 16.2 4 16.5 2.12 18c-.95.77-.54 2.33.49 2.71 1.26.47 2.47-.46 3.65-.46 1.57 0 2.4 1.11 3.44 1.55 1.06.45 2.13-.14 2.4-1.28.36-1.5-.5-2.98-.5-4.52" /></svg>,
};

/* ════════════ TECH STACK DATA ════════════ */
const STACK = [
    { label: "React", cat: "Frontend" },
    { label: "Next.js", cat: "Frontend" },
    { label: "HTML5", cat: "Frontend" },
    { label: "CSS3", cat: "Frontend" },
    { label: "JavaScript", cat: "Frontend" },
    { label: "TypeScript", cat: "Frontend" },
    { label: "Bootstrap", cat: "Frontend" },
    { label: "Tailwind CSS", cat: "Frontend" },
    { label: "Python", cat: "Backend" },
    { label: "Django", cat: "Backend" },
    { label: "Node.js", cat: "Backend" },
    { label: "PostgreSQL", cat: "Backend" },
    { label: "MySQL", cat: "Backend" },
    { label: "REST APIs", cat: "Backend" },
    { label: "Figma", cat: "Design" },
    { label: "Illustrator", cat: "Design" },
    { label: "Photoshop", cat: "Design" },
    { label: "InDesign", cat: "Design" },
    { label: "After Effects", cat: "Design" },
    { label: "CorelDRAW", cat: "Design" },
    { label: "Flutter", cat: "Mobile" },
    { label: "React Native", cat: "Mobile" },
    { label: "WordPress", cat: "CMS" },
    { label: "WooCommerce", cat: "CMS" },
    { label: "AWS", cat: "DevOps" },
    { label: "Docker", cat: "DevOps" },
];

const CAT_COLORS = {
    Frontend: { bg: "rgba(47, 52, 144,0.08)", border: "rgba(47, 52, 144,0.2)", text: "#2F3490", dot: "#2F3490" },
    Backend: { bg: "rgba(255, 0, 107,0.07)", border: "rgba(255, 0, 107,0.22)", text: "#B8004F", dot: "#FF006B" },
    Design: { bg: "rgba(90, 157, 254,0.12)", border: "rgba(90, 157, 254,0.32)", text: "#0057C2", dot: "#5A9DFE" },
    Mobile: { bg: "rgba(0,160,100,0.08)", border: "rgba(0,160,100,0.22)", text: "#006640", dot: "#00A064" },
    CMS: { bg: "rgba(90, 157, 254,0.1)", border: "rgba(90, 157, 254,0.28)", text: "#5A9DFE", dot: "#5A9DFE" },
    DevOps: { bg: "rgba(0,120,200,0.08)", border: "rgba(0,120,200,0.22)", text: "#005A9A", dot: "#0078C8" },
};

/* ════════════ STACK PILL ════════════ */
function StackPill({ label, cat }) {
    const [hov, setHov] = useState(false);
    const c = CAT_COLORS[cat] || CAT_COLORS.Frontend;
    return (
        <span
            data-hover
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.82rem",
                color: hov ? "#fff" : c.text,
                background: hov ? c.dot : c.bg,
                padding: "0.55rem 1.15rem",
                borderRadius: 50,
                border: `1.5px solid ${hov ? c.dot : c.border}`,
                transform: hov ? "translateY(-3px)" : "none",
                transition: "all 0.2s",
                display: "inline-flex", alignItems: "center", gap: "0.42rem",
                boxShadow: hov ? `0 6px 18px ${c.dot}40` : "none",
                letterSpacing: "0.01em", cursor: "default",
            }}
        >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: hov ? "rgba(255,255,255,0.8)" : c.dot, flexShrink: 0, transition: "background 0.2s" }} />
            {label}
        </span>
    );
}

/* ════════════ CARD COMPONENTS ════════════ */
function WhyCard({ Ico, title, desc }) {
    const [hov, setHov] = useState(false);
    return (
        <div data-hover onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: "flex", gap: "1.2rem", padding: "1.5rem", borderRadius: 16, background: "#fff", border: `1px solid ${hov ? C.purpleSoft : C.creamDark}`, transform: hov ? "translateX(8px)" : "translateX(0)", boxShadow: hov ? "0 8px 30px rgba(47, 52, 144,0.09)" : "none", transition: "all 0.3s" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: "rgba(47, 52, 144,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: C.purple }}><Ico /></div>
            <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: C.ink, marginBottom: "0.4rem" }}>{title}</div>
                <p style={{ fontSize: "0.85rem", color: C.inkSoft, lineHeight: 1.78 }}>{desc}</p>
            </div>
        </div>
    );
}

function SvcCard({ s, active, onEnter, onLeave, onClick }) {
    return (
        <div data-hover className="svc-card-white" onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick}>
            <div style={{ position: "absolute", top: "-0.5rem", right: "1rem", fontFamily: "'Bebas Neue',sans-serif", fontSize: "5rem", color: C.purple, opacity: 0.035, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{s.num}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "1.1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: active ? "rgba(47, 52, 144,0.1)" : "rgba(47, 52, 144,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: active ? C.purple : C.inkSoft, transition: "all 0.2s" }}>
                        <s.Ico />
                    </div>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.62rem", fontWeight: 700, color: active ? C.coral : C.inkSoft, letterSpacing: "0.12em", transition: "color 0.2s" }}>{s.num}</span>
                </div>
                <span style={{ color: C.coral, opacity: active ? 1 : 0, transition: "opacity 0.2s, transform 0.2s", transform: active ? "translateX(0)" : "translateX(-6px)", display: "flex" }}><Icon.ArrowRight /></span>
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.4rem,2.4vw,1.9rem)", color: active ? C.purple : C.ink, letterSpacing: "0.01em", marginBottom: "0.75rem", transition: "color 0.2s", lineHeight: 1 }}>{s.name}</div>
            <p style={{ fontSize: "0.84rem", color: C.inkSoft, lineHeight: 1.75, marginBottom: "1.1rem", flex: 1 }}>{s.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.38rem" }}>
                {s.tags.map((t) => (
                    <span key={t} style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.63rem", fontWeight: 700, color: active ? C.purple : C.inkSoft, background: active ? "rgba(47, 52, 144,0.08)" : C.creamDark, padding: "0.2rem 0.6rem", borderRadius: 50, transition: "all 0.2s" }}>{t}</span>
                ))}
            </div>
            <div style={{ width: active ? "100%" : "0%", height: 2, background: C.coral, marginTop: "1.4rem", transition: "width 0.35s ease", borderRadius: 2 }} />
        </div>
    );
}

/* ════════════ APPROACH CARD — coral-tinted glass on purple ════════════ */
function AppCard({ Ico, title, desc }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            data-hover
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: "rgba(255, 0, 107,0.07)",
                border: `1.5px solid ${hov ? "rgba(255, 0, 107,0.55)" : "rgba(255, 0, 107,0.2)"}`,
                borderTop: `3px solid ${C.coral}`,
                borderRadius: 20,
                padding: "2rem",
                height: "100%",
                boxSizing: "border-box",
                transform: hov ? "translateY(-6px)" : "none",
                boxShadow: hov
                    ? "0 20px 48px rgba(255, 0, 107,0.18), 0 4px 16px rgba(0,0,0,0.2)"
                    : "0 4px 20px rgba(0,0,0,0.14)",
                transition: "all 0.28s ease",
            }}
        >
            {/* Icon */}
            <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: hov ? "rgba(255, 0, 107,0.2)" : "rgba(255, 0, 107,0.12)",
                border: `1.5px solid rgba(255, 0, 107,${hov ? "0.45" : "0.25"})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.coral,
                marginBottom: "1.4rem",
                boxShadow: hov ? "0 0 18px rgba(255, 0, 107,0.3)" : "none",
                transition: "all 0.28s",
            }}>
                <Ico />
            </div>

            {/* Title */}
            <div style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.02rem",
                color: "#fff",
                marginBottom: "0.7rem",
            }}>
                {title}
            </div>

            {/* Desc */}
            <p style={{
                color: "rgba(247,243,236,0.6)",
                fontSize: "0.87rem", lineHeight: 1.8,
                margin: 0,
            }}>
                {desc}
            </p>

            {/* Bottom accent line */}
            <div style={{
                marginTop: "1.5rem", height: 2, borderRadius: 2,
                background: `linear-gradient(90deg, ${C.coral}, rgba(255, 0, 107,0))`,
                width: hov ? "100%" : "36%",
                transition: "width 0.35s ease",
            }} />
        </div>
    );
}

function ProcCard({ num, title, desc }) {
    const [hov, setHov] = useState(false);
    return (
        <div data-hover onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ background: "#fff", borderRadius: 20, padding: "2rem", border: `1px solid ${C.creamDark}`, position: "relative", overflow: "hidden", transform: hov ? "translateY(-4px)" : "none", boxShadow: hov ? "0 16px 40px rgba(47, 52, 144,0.1)" : "none", transition: "all 0.3s", height: "100%", boxSizing: "border-box" }}>
            <div style={{ position: "absolute", top: "-0.5rem", right: "1rem", fontFamily: "'Bebas Neue',sans-serif", fontSize: "5rem", color: C.purple, opacity: 0.04, lineHeight: 1, userSelect: "none" }}>{num}</div>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(47, 52, 144,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.85rem", color: C.purple, marginBottom: "1.2rem" }}>{num}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: C.ink, marginBottom: "0.6rem" }}>{title}</div>
            <p style={{ fontSize: "0.87rem", color: C.inkSoft, lineHeight: 1.78 }}>{desc}</p>
        </div>
    );
}

function IndCard({ icon, name, desc, tag, accent = C.coral }) {
    const [hov, setHov] = useState(false);
    return (
        <div data-hover onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                background: hov ? accent : "#fff",
                borderRadius: 16, padding: "1.6rem",
                border: `1px solid ${hov ? accent : C.creamDark}`,
                transform: hov ? "translateY(-5px)" : "none",
                boxShadow: hov ? `0 16px 40px ${accent}38` : "none",
                transition: "all 0.26s ease",
                display: "flex", flexDirection: "column",
                position: "relative", overflow: "hidden",
            }}>
            {/* Ghost background text — more visible */}
            <div style={{
                position: "absolute", bottom: "-0.8rem", right: "-0.2rem",
                fontFamily: "'Bebas Neue',sans-serif", fontSize: "5.5rem",
                color: hov ? "rgba(255,255,255,0.18)" : "rgba(47, 52, 144,0.08)",
                lineHeight: 1, userSelect: "none", pointerEvents: "none",
                transition: "all 0.26s",
                letterSpacing: "0.02em",
            }}>{tag.slice(0, 2).toUpperCase()}</div>

            <div style={{ fontSize: "1.8rem", marginBottom: "0.8rem" }}>{icon}</div>
            <div style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.92rem",
                color: hov ? "#fff" : C.ink,
                marginBottom: "0.5rem", transition: "color 0.26s",
            }}>{name}</div>
            <p style={{
                fontSize: "0.83rem",
                color: hov ? "rgba(255,255,255,0.82)" : C.inkSoft,
                lineHeight: 1.65, flex: 1, marginBottom: "1rem",
                transition: "color 0.26s",
            }}>{desc}</p>


            {/* Tag pill — clearly visible on both white and coral */}
            <span style={{
                fontFamily: "'Syne',sans-serif", fontSize: "0.68rem", fontWeight: 700,
                color: hov ? C.coral : C.purple,
                background: hov ? "#fff" : "rgba(47, 52, 144,0.07)",
                padding: "0.3rem 0.8rem", borderRadius: 50,
                letterSpacing: "0.06em",
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                alignSelf: "flex-start",
                border: `1.5px solid ${hov ? "rgba(255,255,255,0.9)" : "rgba(47, 52, 144,0.15)"}`,
                boxShadow: hov ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
                transition: "all 0.26s",
                position: "relative", zIndex: 1,
            }}>
                <span style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: hov ? C.coral : C.purple,
                    flexShrink: 0,
                    transition: "background 0.26s",
                }} />
                {tag}
            </span>
        </div>
    );
}

/* ════════════ MINI PROCESS — compact 4-step horizontal strip ════════════ */
function MiniProcess({ setPage, goToProcessPipeline }) {
    const STEPS = [
        { num: "01", label: "Discovery" },
        { num: "02", label: "Design" },
        { num: "03", label: "Build" },
        { num: "04", label: "Launch" },
        { num: "05", label: "Support" },
    ];
    const [activeStep, setActiveStep] = useState(2);

    return (
        <section style={{ background: C.purpleDark, padding: "5rem 5%", position: "relative", overflow: "hidden" }}>
            <div style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(4rem,15vw,13rem)", color: "rgba(80,40,140,0.4)", lineHeight: 0.85,
                letterSpacing: "0.01em", userSelect: "none", pointerEvents: "none",
                position: "absolute", bottom: "-1.5rem", right: "-2rem",
                whiteSpace: "nowrap", zIndex: 1,
            }}>PROCESS</div>

            <div className="proc-outer-grid">
                <Reveal>
                    <STag light>How We Work</STag>
                    <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.8rem,6vw,5.5rem)", color: C.cream, lineHeight: 0.9, margin: 0 }}>
                        FROM IDEA TO<br /><span style={{ color: C.coral }}>LIVE PRODUCT</span><br />IN WEEKS.
                    </h2>
                </Reveal>

                <Reveal delay={0.1}>
                    <div className="proc-right-row">
                        {STEPS.map((s, i) => (
                            <button key={s.num} data-hover onClick={() => setActiveStep(i)}
                                className="proc-step-pill"
                                style={{
                                    border: `1.5px solid ${activeStep === i ? "rgba(255, 0, 107,0.65)" : "rgba(255,255,255,0.1)"}`,
                                    background: activeStep === i ? "rgba(255, 0, 107,0.12)" : "rgba(255,255,255,0.04)",
                                    cursor: "none",
                                }}>
                                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: C.coral, lineHeight: 1 }}>{s.num}</span>
                                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.68rem", color: activeStep === i ? "rgba(247,243,236,0.9)" : "rgba(247,243,236,0.55)", whiteSpace: "nowrap" }}>{s.label}</span>
                            </button>
                        ))}
                        <button data-hover className="proc-cta-btn" onClick={goToProcessPipeline}
                            onMouseEnter={e => { e.currentTarget.style.background = "#5A9DFE"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(56, 135, 253,0.45)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = C.purpleMid; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 18px rgba(56, 135, 253,0.3)"; }}>
                            See Full Process
                        </button>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
/* ════════════ HERO SERVICE PANEL ════════════ */
function HeroServicePanel() {
    const SVCS = [
        {
            label: "Web Development", color: "#3887FD",
            desc: "Ultra-fast, SEO-optimised websites and web apps built for conversion from day one.",
            features: ["SEO Optimized", "High Performance", "Clean Architecture"],
            tech: ["React", "Next.js", "TypeScript", "Python", "Django", "Node.js", "PostgreSQL", "Docker", "AWS", "Nginx", "Redis", "Tailwind CSS"],
            badges: ["⚡ Blazing Fast", "🔒 Secure", "📈 SEO-Ready"],
            strip: "Engineered for speed, search rankings, and long-term scalability.",
        },
        {
            label: "UI / UX Design", color: "#FF006B",
            desc: "Design-first sprints in Figma — wireframes to polished interfaces before a line of code.",
            features: ["Modern UI", "User-First", "Conversion Driven"],
            tech: ["Figma", "FigJam", "Adobe XD", "Illustrator", "Photoshop", "Prototyping", "Design Systems", "Lottie", "WCAG", "Zeplin", "Storybook", "Framer"],
            badges: ["✏️ Figma-First", "🎯 Conversion", "♿ Accessible"],
            strip: "Every screen reviewed and approved by you before development begins.",
        },
        {
            label: "App Development", color: "#7C9CFF",
            desc: "Cross-platform iOS & Android apps with Flutter — one codebase, native performance.",
            features: ["Cross-Platform", "Fast UI", "Scalable"],
            tech: ["Flutter", "Dart", "React Native", "JavaScript", "Swift", "Kotlin", "Firebase", "Supabase", "Stripe SDK", "GraphQL", "Push Notifications", "Fastlane"],
            badges: ["📱 iOS & Android", "🔥 Firebase", "🚀 App Store"],
            strip: "From MVP to full App Store launch — handled end-to-end.",
        },
        {
            label: "WordPress & CMS", color: "#5A9DFE",
            desc: "Custom themes and plugins from scratch — no page builders, no bloat, just fast.",
            features: ["Custom Themes", "SEO Ready", "Fast"],
            tech: ["WordPress", "PHP", "MySQL", "ACF Pro", "WP GraphQL", "Gutenberg", "Sanity", "Strapi", "Contentful", "Yoast SEO", "WP Rocket", "Cloudflare"],
            badges: ["🧩 Custom Theme", "⚡ WP Rocket", "🔍 Yoast SEO"],
            strip: "Fully manageable by your team from day one — no technical knowledge needed.",
        },
        {
            label: "E-Commerce", color: "#FF4D8F",
            desc: "Stores engineered to convert — fast pages, smooth checkout, full payment integration.",
            features: ["Payment Ready", "Optimised Checkout", "Scalable"],
            tech: ["WooCommerce", "Shopify", "Next.js", "PHP", "Stripe", "Razorpay", "PayPal", "Klaviyo", "Meta Pixel", "GA4", "Hotjar", "Mailchimp"],
            badges: ["💳 Payments", "📦 Inventory", "📊 Analytics"],
            strip: "Every detail optimised to reduce cart abandonment and increase revenue.",
        },
        {
            label: "Graphic Design", color: "#FF5FA2",
            desc: "Bold logos, brand systems, and print-ready assets — every visual crafted to make your brand impossible to ignore.",
            features: ["Brand Identity", "Print Ready", "Multi-Format"],
            tech: ["Adobe Illustrator", "Photoshop", "InDesign", "Figma", "After Effects", "Brand Guidelines", "Typography Systems", "Colour Theory", "Social Media Kits", "Packaging Design"],
            badges: ["🎨 Brand Identity", "🖨️ Print Ready", "📐 Vector Art"],
            strip: "Every visual crafted from scratch — no templates, no stock, just original brand work.",
        },
    ];

    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => setActive(v => (v + 1) % SVCS.length), 4000);
        return () => clearInterval(t);
    }, [paused]);

    const cur = SVCS[active];
    const ac = cur.color;

    return (
        <div className="hero-svc-panel">
            <div style={{ position: "absolute", top: -80, right: -60, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${ac}18 0%, transparent 65%)`, transition: "background 0.7s", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, left: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${ac}0a 0%, transparent 65%)`, transition: "background 0.7s", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(rgba(120,160,255,0.25) 1px, transparent 1px)`, backgroundSize: "26px 26px", opacity: 0.7 }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${ac}, #FF006B, transparent)`, opacity: 0.9 }} />

            <div className="hero-svc-inner">
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.6rem", fontWeight: 700, color: `${ac}`, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: 18, height: 1.5, background: ac, display: "inline-block" }} />
                    currently building
                </div>
                <div className="svc-title-wrap">
                    {SVCS.map((s, i) => (
                        <div key={s.label} style={{ position: "absolute", left: 0, top: 0, width: "100%", fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2rem, 5vw, 4.4rem)", lineHeight: 1, letterSpacing: "0.02em", color: i === active ? s.color : "transparent", opacity: i === active ? 1 : 0, transform: i === active ? "translateY(0)" : "translateY(18px)", textShadow: i === active ? `0 0 40px ${s.color}70` : "none", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", pointerEvents: "none" }}>{s.label}</div>
                    ))}
                </div>
                <div className="svc-progress-bar">
                    <div key={`${active}-${paused}`} className="svc-progress-fill" style={{ animation: paused ? "none" : "qg-prog 4s linear forwards", background: `linear-gradient(90deg, ${ac}, #FF006B)`, boxShadow: `0 0 8px ${ac}` }} />
                </div>
                <div className="svc-btn-grid">
                    {SVCS.map((s, i) => (
                        <button key={s.label} data-hover onClick={() => { setActive(i); setPaused(true); }}
                            style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(0.55rem, 1.1vw, 0.65rem)", letterSpacing: "0.01em", padding: "0.55rem 0.4rem", borderRadius: 8, cursor: "none", textAlign: "center", lineHeight: 1.3, background: i === active ? `${s.color}22` : "rgba(255,255,255,0.05)", border: `1.5px solid ${i === active ? s.color : "rgba(120,160,255,0.18)"}`, color: i === active ? s.color : "rgba(180,200,255,0.55)", boxShadow: i === active ? `0 0 14px ${s.color}35` : "none", transition: "all 0.25s" }}>
                            {s.label}
                        </button>
                    ))}
                </div>
                <div key={active} className="svc-main-card">
                    <span className="glow-line top" style={{ background: `linear-gradient(90deg, transparent, ${ac}, #FF006B, transparent)`, boxShadow: `0 0 10px ${ac}` }} />
                    <span className="glow-line right" style={{ background: `linear-gradient(180deg, transparent, ${ac}, #FF006B, transparent)`, boxShadow: `0 0 10px ${ac}` }} />
                    <span className="glow-line bottom" style={{ background: `linear-gradient(270deg, transparent, ${ac}, #FF006B, transparent)`, boxShadow: `0 0 10px ${ac}` }} />
                    <span className="glow-line left" style={{ background: `linear-gradient(0deg, transparent, ${ac}, #FF006B, transparent)`, boxShadow: `0 0 10px ${ac}` }} />
                    <div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(0.85rem,1.8vw,1rem)", color: "#E8F0FF", marginBottom: "0.3rem" }}>{cur.label}</div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(0.72rem,1.2vw,0.82rem)", color: "rgba(232,240,255,0.75)", lineHeight: 1.55 }}>{cur.desc}</div>
                    </div>
                    <div className="feat-grid">
                        {cur.features.map((f, i) => (<div key={f} className="feat-pill" style={{ animationDelay: `${i * 0.08}s` }}>{f}</div>))}
                    </div>
                    <div className="tech-pills-row">
                        {cur.tech.map((t, i) => (<span key={t} className="tech-pill-item" style={{ animationDelay: `${0.2 + i * 0.08}s`, background: `${ac}22`, border: `1px solid ${ac}55`, color: ac }}>{t}</span>))}
                    </div>
                    <div className="info-row-grid">
                        {cur.badges.map(label => (<div key={label} className="info-cell">{label}</div>))}
                    </div>



                    <div className="bottom-strip">{cur.strip}</div>
                </div>
            </div>
        </div>
    );
}

/* ════════════ HOME PAGE ════════════ */
function useWindowWidth() {
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
    useEffect(() => {
        const h = () => setW(window.innerWidth);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);
    return w;
}

function HomePage({ setPage, goToService, goToContactForm, goToProcessPipeline }) {
    const width = useWindowWidth();
    const sm = width <= 767;
    const md = width >= 768 && width <= 1023;
    const MQ1 = ["Web Development", "UI/UX Design", "App Development", "E-Commerce", "WordPress", "Real Estate Tech", "SEO & Growth"];
    const MQ2 = ["Fast Delivery", "Pixel Perfect", "Clean Code", "Mobile First", "SEO Ready", "Full Support", "Scalable"];
    const MQ3 = ["React", "Next.js", "Django", "Tailwind", "WordPress", "PostgreSQL", "Flutter", "Figma"];

    const SERVICES = [
        { num: "01", id: "web", name: "Web Development", Ico: Icon.Globe, desc: "Pixel-perfect, fast-loading websites built with React, Next.js, and Django. Clean code, stunning UI.", tags: ["React", "Next.js", "Django", "TypeScript", "PostgreSQL", "Docker"] },
        { num: "02", id: "uiux", name: "UI / UX Design", Ico: Icon.Pen, desc: "Figma-first design sprints. Wireframes to polished interfaces — from concept to code.", tags: ["Figma", "Prototyping", "Design Systems", "Wireframing", "Accessibility"] },
        { num: "03", id: "app", name: "App Development", Ico: Icon.Phone, desc: "Cross-platform mobile apps with Flutter and React Native. One codebase, two platforms.", tags: ["Flutter", "React Native", "Firebase", "iOS/Android", "Dart", "Kotlin"] },
        { num: "04", id: "wp", name: "WordPress & CMS", Ico: Icon.Zap, desc: "Custom WordPress themes, plugins, and headless CMS setups for editorial teams.", tags: ["WordPress", "WooCommerce", "ACF Pro", "Headless CMS", "REST API"] },
        { num: "05", id: "ecom", name: "E-Commerce Solutions", Ico: Icon.Cart, desc: "High-converting stores with WooCommerce and Stripe integration, built for growth.", tags: ["WooCommerce", "Shopify", "Stripe", "Razorpay", "Inventory", "Analytics"] },
        { num: "06", id: "gd", name: "Graphic Design", Ico: Icon.Brush, desc: "Bold logos, brand identities, marketing materials, and print-ready assets crafted to make your brand unforgettable.", tags: ["Illustrator", "Brand Identity", "Typography", "Print Design", "Social Kits", "Figma"] },
    ];

    const [activeCard, setActiveCard] = useState(null);

    const INDUSTRIES = [
        { icon: "🛒", name: "Retail & E-Commerce", desc: "High-converting stores with seamless product browsing and blazing-fast checkout.", tag: "E-Commerce + Shopify" },
        { icon: "💼", name: "Finance & FinTech", desc: "Secure dashboards, payment integrations, and data-heavy SaaS platforms built to scale.", tag: "Web App" },
        { icon: "🏥", name: "Health & Wellness", desc: "Booking systems, patient portals, and telehealth apps built for trust and ease.", tag: "App + Web" },
        { icon: "🎓", name: "Education & EdTech", desc: "LMS platforms, course portals, and student apps that make learning genuinely click.", tag: "Platform" },
        { icon: "🎨", name: "Creative Agencies", desc: "Bespoke design tooling, portfolio sites, brand microsites, and client-facing presentation decks.", tag: "Web + Design" },
        { icon: "🚚", name: "Logistics & Delivery", desc: "Tracking dashboards, driver apps, and customer portals — the complete ops stack.", tag: "Mobile + Web" },
        { icon: "📰", name: "Media & Publishing", desc: "Custom WordPress and headless CMS setups for editorial teams demanding speed.", tag: "WordPress" },
        { icon: "🍔", name: "Food & Hospitality", desc: "Table booking, online ordering, menu management — seamless digital dining.", tag: "App + Web" },
    ];

    return (
        <div style={{ width: "100%", minWidth: 0, paddingTop: 70 }}>

            {/* ══ HERO ══ */}
            <div className="hero-grid">
                <div style={{ background: C.purpleDark, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", minHeight: (sm || md) ? "auto" : "calc(100vh - 70px)" }}>
                    <div style={{ position: "absolute", top: "-5rem", left: "-5rem", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle,${C.purpleMid} 0%,transparent 65%)`, opacity: 0.45, pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(255, 0, 107,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3, background: "linear-gradient(180deg,transparent,#FF006B,transparent)", borderRadius: "0 2px 2px 0" }} />
                    <div style={{ position: "absolute", right: "1.5rem", bottom: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", zIndex: 3 }}>
                        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.58rem", fontWeight: 700, color: "rgba(247,243,236,0.25)", letterSpacing: "0.22em", textTransform: "uppercase", writingMode: "vertical-rl" }}>SCROLL DOWN</span>
                        <div style={{ width: 1, height: 60, background: "linear-gradient(180deg, rgba(247,243,236,0.15), #FF006B)", borderRadius: 2 }} />
                    </div>
                    <div className="hero-left-inner" style={{ justifyContent: (sm || md) ? "flex-start" : "center", position: "relative" }}>
                        <div className="hero-qg-ghost" style={{ position: "absolute", right: "3rem", top: "50%", transform: "translateY(-50%)", fontFamily: "'Bebas Neue',sans-serif", lineHeight: 0.82, userSelect: "none", pointerEvents: "none", zIndex: 0, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            {["GUGULO", "TRE"].map((w) => (
                                <div key={w} style={{ fontSize: "clamp(3.6rem,8.5vw,7.5rem)", color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.09)", letterSpacing: "0.04em" }}>{w}</div>
                            ))}
                        </div>
                        <div style={{ position: "relative", zIndex: 1, lineHeight: 0.85, marginBottom: "1.8rem" }}>
                            <div className="hero-hl-size" style={{ color: "#fff" }}>WE BUILD</div>
                            <div className="hero-hl-size" style={{ color: "transparent", WebkitTextStroke: `2px ${C.purpleSoft}` }}>DIGITAL</div>
                            <div className="hero-hl-size" style={{ color: C.coral }}>FUTURES.</div>
                        </div>
                        <p style={{ position: "relative", zIndex: 1, fontFamily: "'Outfit',sans-serif", fontSize: "clamp(0.85rem,1.1vw,0.95rem)", color: "rgba(247,243,236,0.45)", lineHeight: 1.9, maxWidth: 400, marginBottom: "2rem" }}>
                            Gugulotre is a bold digital studio crafting high-performance websites, apps, and digital experiences. We combine cutting-edge technology with pixel-perfect design — delivering premium products at startup speed.
                        </p>
                        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
                            <BtnCoral onClick={goToContactForm}
                                style={{ justifyContent: "center", padding: "0.88rem 1.2rem" }}>Start a Project</BtnCoral>
                            <BtnGhost onClick={() => setPage("Services")} dark style={{ justifyContent: "center", padding: "0.88rem 1.2rem" }}>See Our Work</BtnGhost>
                        </div>
                    </div>
                </div>
                <HeroServicePanel />
            </div>

            {/* ══ MARQUEE 1 ══ */}
            <Marquee items={MQ1} blue />

            {/* ══ WHY GUGULOTRE ══ */}
            <section className="qg-section" style={{ background: C.cream }}>
                <div className="why-grid">
                    <Reveal style={{ height: "100%" }}>
                        <div style={{ background: C.purple, borderRadius: 24, padding: "3rem", position: "relative", overflow: "hidden", boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%" }}>
                            <div style={{ position: "absolute", bottom: "-1.5rem", right: "-0.5rem", fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(5rem,12vw,9rem)", color: C.cream, opacity: 0.04, userSelect: "none", pointerEvents: "none", lineHeight: 1 }}>GT</div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(255, 0, 107,0.12)", border: "1px solid rgba(255, 0, 107,0.18)", borderRadius: 50, padding: "0.35rem 0.9rem", width: "fit-content", marginBottom: "2rem" }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.coral, animation: "breathe 2s ease infinite" }} />
                                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.65rem", fontWeight: 700, color: C.coral, letterSpacing: "0.12em", textTransform: "uppercase" }}>Why Gugulotre</span>
                            </div>
                            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.5rem,7vw,4.8rem)", color: "#fff", lineHeight: 0.88, marginBottom: "1.6rem", flex: 1 }}>
                                CRAFTED<br /><span style={{ color: C.coral }}>WITH</span><br /><span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.35)", color: "transparent" }}>FULL</span><br />FOCUS.
                            </div>
                            <p style={{ color: "rgba(247,243,236,0.5)", fontSize: "0.9rem", lineHeight: 1.85, maxWidth: 320 }}>We treat every project as the centrepiece of our work. Precision, speed, and genuine care — baked into everything we deliver.</p>
                        </div>
                    </Reveal>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem", justifyContent: "center" }}>
                        {[
                            { Ico: Icon.Target, title: "Dedicated Attention", desc: "No ticket queues, no bloated processes. Your project gets focused, direct communication with the people actually building it." },
                            { Ico: Icon.Flame, title: "Performance-Driven Builds", desc: "Every interface we ship is fast, accessible, and engineered to convert. Beautiful design backed by clean, maintainable code." },
                            { Ico: Icon.Refresh, title: "Transparent Pricing", desc: "Clear, honest pricing with no hidden fees. You'll always know exactly what you're getting before we start — no surprises." },
                        ].map((item, i) => (
                            <Reveal key={item.title} delay={i * 0.1}><WhyCard Ico={item.Ico} title={item.title} desc={item.desc} /></Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ SERVICES ══ */}
            <section style={{ background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", padding: "4rem 5% 2.5rem", borderBottom: `1px solid ${C.creamDark}` }}>
                    <div>
                        <Reveal><STag>What We Build</STag></Reveal>
                        <Reveal delay={0.08}><h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.8rem,4.8vw,3.8rem)", lineHeight: 1.03, color: C.ink }}>Full-Stack Capability.<br />End-to-End Delivery.</h2></Reveal>
                    </div>
                    <Reveal delay={0.14}><ViewAllBtn onClick={() => setPage("Services")}>View All Services</ViewAllBtn></Reveal>
                </div>
                <div style={{ padding: "2rem 5% 3rem" }}>
                    <div className="svc-grid">
                        {SERVICES.map((s, i) => (
                            <Reveal key={s.num} delay={(i % 3) * 0.06} style={{ height: "100%", display: "flex" }}>
                                <SvcCard
                                    s={s}
                                    active={activeCard === i}
                                    onEnter={() => setActiveCard(i)}
                                    onLeave={() => setActiveCard(null)}
                                    onClick={() => goToService(s.id)}   // ← was setPage("Services")
                                />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ MARQUEE 2 ══ */}
            <Marquee items={MQ2} blue reverse />

            {/* ══ OUR APPROACH ══ */}
            <section className="qg-section" style={{ background: C.purple, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%,rgba(255, 0, 107,0.06),transparent 50%),radial-gradient(ellipse at 80% 50%,rgba(90, 157, 254,0.3),transparent 50%)" }} />
                <div style={{ position: "absolute", right: 0, top: "14%", fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(3.6rem,8.5vw,7.5rem)", color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.07)", userSelect: "none", pointerEvents: "none", lineHeight: 0.85, textAlign: "right", overflow: "hidden", maxWidth: "35%" }}>GUGULO<br />TRE</div>

                <div style={{ position: "relative", zIndex: 2, paddingBottom: "2.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "2.5rem" }}>
                    <Reveal>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255, 0, 107,0.12)", border: "1px solid rgba(255, 0, 107,0.22)", borderRadius: 50, padding: "0.4rem 1.1rem", marginBottom: "1.2rem" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.coral, animation: "breathe 2s ease infinite" }} />
                            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.68rem", fontWeight: 700, color: C.coral, letterSpacing: "0.14em", textTransform: "uppercase" }}>Our Approach</span>
                        </div>
                        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.8rem,5.5vw,4.2rem)", color: "#fff", lineHeight: 1, marginBottom: "0.8rem" }}>Your Vision.<br /><span style={{ color: C.coral }}>Delivered With Precision.</span></h2>
                        <p style={{ color: "rgba(247,243,236,0.5)", maxWidth: 520, lineHeight: 1.85, fontSize: "0.95rem" }}>We combine strong design instincts with solid engineering to build web products that look great, perform flawlessly, and grow with your business.</p>
                    </Reveal>
                </div>

                <div style={{ position: "relative", zIndex: 2 }}>
                    <div className="app-grid" style={{ marginBottom: "2.5rem" }}>
                        {[
                            { Ico: Icon.Users, title: "Direct Communication", desc: "No account managers or middlemen. Work directly with the people designing and building your product — clear updates, faster decisions." },
                            { Ico: Icon.Mail, title: "Honest Pricing", desc: "Transparent quotes, no hidden costs. You'll know exactly what you're paying for and why, before a single file is opened." },
                            { Ico: Icon.Refresh, title: "Revision-Friendly Process", desc: "We iterate until you're genuinely thrilled with the result. Your satisfaction drives every design and development decision we make." },
                        ].map((item, i) => (
                            <Reveal key={item.title} delay={i * 0.1}><AppCard Ico={item.Ico} title={item.title} desc={item.desc} /></Reveal>
                        ))}
                    </div>
                    <Reveal delay={0.3}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: 420 }}>Ready to build something that stands out? Book a free strategy call — let's talk about your project.</p>
                            <BtnCoral onClick={goToContactForm} style={{ fontSize: "0.95rem", padding: "0.9rem 2.1rem" }}>Start Your Project</BtnCoral>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══ TECH STACK ══ */}
            <section className="qg-section" style={{ background: C.cream, textAlign: "center" }}>
                <Reveal><STag center>Technologies We Command</STag></Reveal>
                <Reveal delay={0.08}>
                    <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.8rem,4.8vw,3.8rem)", color: C.ink }}>
                        Modern Stack. <span style={{ color: C.coral }}>Future-Proof Code.</span>
                    </h2>
                </Reveal>
                <Reveal delay={0.14}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "center", marginTop: "1.8rem" }}>
                        {STACK.map((t) => <StackPill key={t.label} label={t.label} cat={t.cat} />)}
                    </div>
                </Reveal>
            </section>

            {/* ══ MINI PROCESS ══ */}
            <MiniProcess setPage={setPage} goToProcessPipeline={goToProcessPipeline} />

            {/* ══ INDUSTRIES ══ */}
            <section className="qg-section" style={{ background: C.creamDark }}>
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <Reveal><STag center>Industries We Serve</STag></Reveal>
                    <Reveal delay={0.08}><h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.8rem,5vw,3.8rem)", color: C.ink }}>Built for Every Sector.</h2></Reveal>
                    <Reveal delay={0.14}><p style={{ color: C.inkSoft, maxWidth: 480, margin: "0.8rem auto 0", lineHeight: 1.7, fontSize: "0.95rem" }}>From emerging startups to growing businesses — we deliver across all verticals with precision and care.</p></Reveal>
                </div>
                <div className="ind-grid" style={{ gap: "1.1rem", alignItems: "stretch" }}>
                    {INDUSTRIES.map((ind, i) => (<Reveal key={ind.name} delay={(i % 4) * 0.06} style={{ height: "100%", display: "flex" }} > <IndCard {...ind} accent={i % 2 === 0 ? C.purpleMid : C.coral} /></Reveal>))}
                </div>
            </section >

            {/* ══ MARQUEE 3 ══ */}
            <Marquee items={MQ3} blue />

        </div >
    );
}

/* ════════════ ROOT ════════════ */
export default function Gugulotrehome({ setPage, goToService, goToContactForm, goToProcessPipeline }) {
    return <HomePage setPage={setPage} goToService={goToService} goToContactForm={goToContactForm} goToProcessPipeline={goToProcessPipeline} />;
}