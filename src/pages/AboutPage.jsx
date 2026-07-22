import { useState, useEffect, useRef } from "react";

/* ════ THEME — original ════ */
const C = {
    ink: "#1A1118",
    inkSoft: "#5C5068",
    cream: "#F7F3EC",
    creamDark: "#EDE7DC",
    purple: "#2F3490",
    purpleMid: "#3887FD",
    purpleDark: "#1E0A42",
    purpleSoft: "#5A9DFE",
    coral: "#FF006B",
    orangeWarm: "#FF006B",
};

/* ════ REVEAL ════ */
function Reveal({ children, delay = 0, style = {} }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
            { threshold: 0.06 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(24px)",
            transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
            ...style
        }}>
            {children}
        </div>
    );
}

/* ════ SECTION TAG ════ */
function STag({ children, light = false, center = false }) {
    return (
        <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: light ? "rgba(247,243,236,0.45)" : C.inkSoft,
            display: "flex", alignItems: "center", gap: "0.6rem",
            marginBottom: "1.1rem",
            justifyContent: center ? "center" : "flex-start",
        }}>
            <span style={{ width: 20, height: 2, background: C.coral, display: "inline-block", flexShrink: 0 }} />
            {children}
        </div>
    );
}

/* ════ MARQUEE ════ */
function Marquee({ items, coral = false, blue = false, reverse = false }) {
    const tripled = [...items, ...items, ...items];
    return (
        <div style={{ background: coral ? C.coral : blue ? C.purpleMid : C.creamDark, padding: "0.9rem 0", overflow: "hidden" }}>
            <div style={{
                display: "flex", gap: "2.5rem", whiteSpace: "nowrap",
                width: "max-content",
                animation: `${reverse ? "marqueeRev" : "marquee"} 35s linear infinite`,
            }}>
                {tripled.map((item, i) => (
                    <span key={i} style={{
                        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.78rem",
                        color: (coral || blue) ? "rgba(255,255,255,0.85)" : C.inkSoft,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "0.6rem",
                    }}>
                        {item}
                        <span style={{ color: (coral || blue) ? "rgba(255,255,255,0.5)" : C.coral, fontSize: "0.48rem" }}>●</span>
                    </span>
                ))}
            </div>
            <style>{`
                @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
                @keyframes marqueeRev { from { transform: translateX(-33.333%); } to { transform: translateX(0); } }
            `}</style>
        </div>
    );
}

/* ════ WINDOW WIDTH ════ */
function useWindowWidth() {
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
    useEffect(() => {
        const h = () => setW(window.innerWidth);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);
    return w;
}

/* ════ WHY CARD ════ */
function WhyCard({ icon, title, desc }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex", gap: "1.2rem", padding: "1.5rem",
                borderRadius: 16, background: "#fff",
                border: `1px solid ${hov ? C.purpleSoft : C.creamDark}`,
                transform: hov ? "translateX(8px)" : "translateX(0)",
                boxShadow: hov ? "0 8px 30px rgba(47, 52, 144,0.09)" : "none",
                transition: "all 0.3s",
            }}
        >
            <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: "rgba(47, 52, 144,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem",
            }}>{icon}</div>
            <div>
                <div style={{
                    fontFamily: "'Syne',sans-serif", fontWeight: 700,
                    fontSize: "0.95rem", color: C.ink, marginBottom: "0.4rem",
                }}>{title}</div>
                <p style={{ fontSize: "0.85rem", color: C.inkSoft, lineHeight: 1.78, margin: 0 }}>{desc}</p>
            </div>
        </div>
    );
}

/* ════ STEP BADGES ════ */
const ABOUT_STEP_BADGES = {
    "01": ["🎯 Goal-Driven", "📋 Documented", "🤝 Collaborative"],
    "02": ["✏️ Figma-First", "🖼️ Hi-Fi Ready", "🔄 Revision-Friendly"],
    "03": ["🔗 Live Previews", "🧱 Clean Code", "⚙️ Sprint-Based"],
    "04": ["📦 Full Source", "📄 Documented", "🚀 Production-Ready"],
    "05": ["🛡️ Bug Fixes", "📊 Performance", "📞 On-Call"],
};


/* ════ HOW WE WORK ════ */
function HowWeWorkPanel({ sm, md, desktop }) {
    const STEPS = [
        {
            num: "01", label: "Discovery", icon: "🔍", color: "#3887FD",
            desc: "A focused strategy session to map your goals, audience, and exact project scope before any work begins.",
            features: ["Goals & KPIs defined", "Scope documented", "Timeline agreed"],
            tag: "Free Consultation",
        },
        {
            num: "02", label: "Design", icon: "🎨", color: "#FF006B",
            desc: "Figma wireframes and full visual designs are delivered and approved before a single line of code is written.",
            features: ["Wireframes first", "Full visual design", "Your feedback loop"],
            tag: "Design Sprint",
        },
        {
            num: "03", label: "Build", icon: "⚙️", color: "#7C9CFF",
            desc: "Development in focused sprints with live preview links shared at every major milestone.",
            features: ["Live preview links", "Regular check-ins", "Clean architecture"],
            tag: "Active Build",
        },
        {
            num: "04", label: "Launch", icon: "🚀", color: "#5A9DFE",
            desc: "Full deployment handled end-to-end — with documentation and a clean handoff to your team.",
            features: ["Deployment handled", "Full source code", "Handoff docs"],
            tag: "Go Live",
        },
        {
            num: "05", label: "Support", icon: "🛡️", color: "#FF4D8F",
            desc: "Post-launch support is included as standard. We remain available after delivery for fixes and follow-ups.",
            features: ["Bug fixes included", "Performance checks", "On-call support"],
            tag: "Post Launch",
        },
    ];

    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const [animKey, setAnimKey] = useState(0);

    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => {
            setActive(v => (v + 1) % STEPS.length);
            setAnimKey(k => k + 1);
        }, 4000);
        return () => clearInterval(t);
    }, [paused]);

    const handleSelect = (i) => {
        setActive(i);
        setAnimKey(k => k + 1);
        setPaused(true);
    };

    const cur = STEPS[active];
    const ac = cur.color;

    /* On desktop: side-by-side pills (left col) + full card (right col)
       On tablet/mobile: card on top, pills as horizontal scroll row below */
    return (
        <section style={{
            background: "linear-gradient(160deg, #0A0B1F 0%, #14163A 40%, #1D2060 70%, #0A0B1F 100%)",
            padding: sm ? "2.8rem 5% 3rem" : md ? "3.5rem 5%" : "5rem 6%",
            position: "relative", overflow: "hidden",
        }}>
            {/* Dot grid */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "radial-gradient(rgba(120,160,255,0.15) 1px, transparent 1px)",
                backgroundSize: "28px 28px", opacity: 0.6,
            }} />
            {/* Ambient glows */}
            <div style={{ position: "absolute", top: -120, right: -100, width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${ac}1a 0%, transparent 65%)`, transition: "background 0.7s", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -80, left: -60, width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, ${ac}0e 0%, transparent 65%)`, transition: "background 0.7s", pointerEvents: "none" }} />
            {/* Top bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${ac}, #FF006B, transparent)`, opacity: 0.9, transition: "background 0.7s" }} />

            <div style={{ position: "relative", zIndex: 2 }}>

                {/* Header */}
                <div style={{ marginBottom: sm ? "1.8rem" : "2.6rem" }}>
                    <div style={{
                        fontFamily: "'Syne',sans-serif", fontSize: "0.65rem", fontWeight: 700,
                        color: ac, letterSpacing: "0.22em", textTransform: "uppercase",
                        marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem",
                        transition: "color 0.5s",
                    }}>
                        <span style={{ width: 18, height: 1.5, background: ac, display: "inline-block", transition: "background 0.5s" }} />
                        How We Work
                    </div>
                    <h2 style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: sm ? "clamp(2.2rem,9vw,3rem)" : md ? "clamp(2.8rem,6vw,4rem)" : "clamp(3rem,5vw,5rem)",
                        color: "#fff", lineHeight: 0.92, margin: 0, letterSpacing: "0.01em",
                    }}>
                        FROM BRIEF TO<br />
                        <span style={{ color: ac, transition: "color 0.5s" }}>LIVE PRODUCT.</span>
                    </h2>
                </div>

                {desktop ? (
                    /* ── DESKTOP: Vertical pills left | Big card right ── */
                    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", alignItems: "start" }}>
                        {/* Vertical step pills */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                            {STEPS.map((s, i) => (
                                <button
                                    key={s.num}
                                    onClick={() => handleSelect(i)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "0.9rem",
                                        padding: "0.9rem 1.1rem",
                                        borderRadius: 12, cursor: "pointer", textAlign: "left",
                                        background: active === i ? `${s.color}20` : "rgba(255,255,255,0.04)",
                                        border: `1.5px solid ${active === i ? s.color : "rgba(120,160,255,0.18)"}`,
                                        boxShadow: active === i ? `0 0 18px ${s.color}30` : "none",
                                        transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
                                        width: "100%",
                                    }}
                                >
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                                        background: active === i ? s.color : "rgba(255,255,255,0.06)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.28s",
                                    }}>
                                        <span style={{
                                            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.68rem",
                                            color: active === i ? "#fff" : "rgba(180,200,255,0.55)",
                                            transition: "color 0.28s",
                                        }}>{s.num}</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem",
                                            color: active === i ? s.color : "rgba(180,200,255,0.55)",
                                            transition: "color 0.28s",
                                        }}>{s.label}</div>
                                        <div style={{
                                            fontFamily: "'Outfit',sans-serif", fontSize: "0.63rem",
                                            color: active === i ? "rgba(247,243,236,0.55)" : "rgba(247,243,236,0.22)",
                                            transition: "color 0.28s", marginTop: "0.08rem",
                                        }}>{s.tag}</div>
                                    </div>
                                    <span style={{
                                        color: active === i ? s.color : "transparent",
                                        fontWeight: 700, fontSize: "0.88rem",
                                        transition: "all 0.25s",
                                        transform: active === i ? "translateX(0)" : "translateX(-6px)",
                                        flexShrink: 0,
                                    }}>→</span>
                                </button>
                            ))}
                            <button
                                onClick={() => setPaused(v => !v)}
                                style={{
                                    fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.6rem",
                                    letterSpacing: "0.1em", textTransform: "uppercase",
                                    background: "none", border: "none", cursor: "pointer",
                                    color: "rgba(180,200,255,0.5)", textAlign: "left",
                                    padding: "0.2rem 0", marginTop: "0.1rem",
                                }}
                            >{paused ? "▶ Resume" : "⏸ Pause"}</button>
                        </div>

                        {/* Detail card — full height, rich layout */}
                        <DetailCard key={animKey} cur={cur} ac={ac} paused={paused} sm={false} setPaused={setPaused} showPause={false} />
                    </div>
                ) : sm ? (
                    /* ── MOBILE: Card full width, then swipeable dot-nav pills ── */
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                        <DetailCard key={animKey} cur={cur} ac={ac} paused={paused} sm setPaused={setPaused} showPause={false} />
                        {/* Dot nav */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                            {STEPS.map((s, i) => (
                                <button key={i} onClick={() => handleSelect(i)} style={{
                                    width: active === i ? 28 : 8, height: 8,
                                    borderRadius: 50, border: "none", cursor: "pointer",
                                    background: active === i ? s.color : "rgba(120,160,255,0.25)",
                                    boxShadow: active === i ? `0 0 8px ${s.color}` : "none",
                                    transition: "all 0.3s ease",
                                }} />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* ── TABLET: Card on top full width, pills as 5-col grid below ── */
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                        <DetailCard key={animKey} cur={cur} ac={ac} paused={paused} sm={false} setPaused={setPaused} showPause />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "0.5rem" }}>
                            {STEPS.map((s, i) => (
                                <button key={s.num} onClick={() => handleSelect(i)} style={{
                                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.4rem",
                                    padding: "0.9rem 0.8rem", borderRadius: 12, cursor: "pointer", textAlign: "left",
                                    background: active === i ? `${s.color}20` : "rgba(255,255,255,0.04)",
                                    border: `1.5px solid ${active === i ? s.color : "rgba(120,160,255,0.18)"}`,
                                    boxShadow: active === i ? `0 0 14px ${s.color}30` : "none",
                                    transition: "all 0.28s",
                                }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                                        background: active === i ? s.color : "rgba(255,255,255,0.06)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.62rem", color: active === i ? "#fff" : "rgba(180,200,255,0.5)" }}>{s.num}</span>
                                    </div>
                                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.72rem", color: active === i ? s.color : "rgba(180,200,255,0.55)" }}>{s.label}</div>
                                </button>
                            ))}
                        </div>
                        {/* Dot nav on tablet too */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                            {STEPS.map((s, i) => (
                                <button key={i} onClick={() => handleSelect(i)} style={{
                                    width: active === i ? 28 : 8, height: 8,
                                    borderRadius: 50, border: "none", cursor: "pointer",
                                    background: active === i ? s.color : "rgba(120,160,255,0.25)",
                                    transition: "all 0.3s ease",
                                }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes aboutPanelIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes aboutIconFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
                @keyframes qg-prog { from { width: 0%; } to { width: 100%; } }
                @keyframes moveTop { 0%{left:0;width:0}50%{left:0;width:70%}100%{left:100%;width:0} }
                @keyframes moveRight { 0%{top:0;height:0}50%{top:0;height:70%}100%{top:100%;height:0} }
                @keyframes moveBottom { 0%{right:0;width:0}50%{right:0;width:70%}100%{right:100%;width:0} }
                @keyframes moveLeft { 0%{bottom:0;height:0}50%{bottom:0;height:70%}100%{bottom:100%;height:0} }
                @keyframes breathe { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
            `}</style>
        </section>
    );
}

/* ════ DETAIL CARD (shared by all breakpoints) ════ */
function DetailCard({ cur, ac, paused, sm, setPaused, showPause }) {
    return (
        <div style={{
            borderRadius: 20,
            border: `2px solid ${ac}55`,
            background: `linear-gradient(135deg, ${ac}12 0%, rgba(0,0,0,0.3) 100%)`,
            backdropFilter: "blur(12px)",
            padding: sm ? "1.6rem 1.4rem" : "2.2rem 2.8rem",
            position: "relative", overflow: "hidden",
            boxShadow: `0 0 60px ${ac}18, inset 0 0 30px ${ac}08`,
            animation: "aboutPanelIn 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
        }}>
            {/* Animated border lines */}
            <span style={{ position: "absolute", top: 0, left: 0, height: 2, width: "70%", background: `linear-gradient(90deg,transparent,${ac},#FF006B,transparent)`, pointerEvents: "none", animation: "moveTop 2.5s linear infinite" }} />
            <span style={{ position: "absolute", top: 0, right: 0, width: 2, height: "70%", background: `linear-gradient(180deg,transparent,${ac},#FF006B,transparent)`, pointerEvents: "none", animation: "moveRight 2.5s linear infinite", animationDelay: "0.6s" }} />
            <span style={{ position: "absolute", bottom: 0, right: 0, height: 2, width: "70%", background: `linear-gradient(270deg,transparent,${ac},#FF006B,transparent)`, pointerEvents: "none", animation: "moveBottom 2.5s linear infinite", animationDelay: "1.2s" }} />
            <span style={{ position: "absolute", bottom: 0, left: 0, width: 2, height: "70%", background: `linear-gradient(0deg,transparent,${ac},#FF006B,transparent)`, pointerEvents: "none", animation: "moveLeft 2.5s linear infinite", animationDelay: "1.8s" }} />

            {/* Ghost number */}
            <div style={{
                position: "absolute", top: "-0.5rem", right: "0.8rem",
                fontFamily: "'Bebas Neue',sans-serif", fontSize: sm ? "5rem" : "8rem",
                color: ac, opacity: 0.06, lineHeight: 1,
                userSelect: "none", pointerEvents: "none",
            }}>{cur.num}</div>

            {/* Main content — 2-col grid on desktop */}
            <div style={{
                display: "grid",
                gridTemplateColumns: sm ? "1fr" : "1fr 1fr",
                gap: sm ? "1.2rem" : "2rem",
                alignItems: "start",
                position: "relative", zIndex: 2,
            }}>
                {/* Left */}
                <div>
                    {/* Icon + tag */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <div style={{
                            width: sm ? 40 : 52, height: sm ? 40 : 52, borderRadius: 14, flexShrink: 0,
                            background: `${ac}22`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: sm ? "1.2rem" : "1.6rem",
                            animation: "aboutIconFloat 3s ease infinite",
                        }}>{cur.icon}</div>
                        <span style={{
                            fontFamily: "'Syne',sans-serif", fontSize: "0.64rem", fontWeight: 700,
                            letterSpacing: "0.14em", textTransform: "uppercase",
                            background: `${ac}22`, border: `1.5px solid ${ac}55`,
                            color: ac, padding: "0.22rem 0.75rem", borderRadius: 50,
                        }}>{cur.tag}</span>
                    </div>

                    {/* Step name */}
                    <div style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: sm ? "clamp(2rem,8vw,2.6rem)" : "clamp(2.2rem,3.5vw,3.2rem)",
                        color: "#fff", lineHeight: 1, marginBottom: "0.8rem",
                        textShadow: `0 0 40px ${ac}55`,
                    }}>{cur.num} — {cur.label}</div>

                    {/* Description */}
                    <p style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: sm ? "0.83rem" : "0.92rem",
                        color: "rgba(215,228,255,0.8)", lineHeight: 1.8,
                        margin: 0,
                    }}>{cur.desc}</p>
                </div>

                {/* Right */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {/* Feature pills */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {cur.features.map((f, i) => (
                            <div key={f} style={{
                                background: "rgba(255,255,255,0.07)",
                                border: `1px solid ${ac}30`,
                                borderLeft: `3px solid ${ac}`,
                                borderRadius: "0 8px 8px 0",
                                padding: "0.55rem 0.8rem",
                                fontFamily: "'Syne',sans-serif", fontWeight: 600,
                                fontSize: "0.72rem", color: "#CFE0FF",
                                display: "flex", alignItems: "center", gap: "0.5rem",
                                animation: "aboutPanelIn 0.4s ease forwards",
                                animationDelay: `${i * 0.07}s`, opacity: 0,
                            }}>
                                <span style={{ color: ac, fontWeight: 800 }}>✓</span> {f}
                            </div>
                        ))}
                    </div>

                    {/* Info badges */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.4rem" }}>
                        {(ABOUT_STEP_BADGES[cur.num] || ["⚡ Efficient", "🔒 Transparent", "📈 Accountable"]).map((label, bi) => (
                            <div key={label} style={{
                                background: "rgba(255,255,255,0.06)",
                                border: `1px solid ${ac}30`,
                                borderTop: `2px solid ${ac}`,
                                borderRadius: 8,
                                padding: "0.5rem 0.2rem",
                                fontFamily: "'Syne',sans-serif",
                                fontSize: "0.55rem",
                                fontWeight: 700,
                                color: ac,
                                textAlign: "center",
                                letterSpacing: "0.02em",
                                transition: `all 0.35s ease ${bi * 0.07}s`,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "0.15rem",
                                boxShadow: `0 2px 10px ${ac}18`,
                            }}>
                                <span style={{ fontSize: "0.8rem", lineHeight: 1 }}>
                                    {label.split(" ")[0]}
                                </span>
                                <span style={{ lineHeight: 1.2, opacity: 0.85 }}>
                                    {label.split(" ").slice(1).join(" ")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div style={{
                marginTop: "1.4rem", height: 2.5,
                background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden",
                position: "relative", zIndex: 2,
            }}>
                <div
                    style={{
                        height: "100%",
                        background: `linear-gradient(90deg,${ac},#FF006B)`,
                        borderRadius: 2, transformOrigin: "left",
                        boxShadow: `0 0 8px ${ac}`,
                        animation: paused ? "none" : "qg-prog 4s linear forwards",
                        width: paused ? "100%" : undefined,
                    }}
                />
            </div>

            {/* Footer */}
            <div style={{
                marginTop: "0.6rem", position: "relative", zIndex: 2,
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <span style={{
                    fontFamily: "'Syne',sans-serif", fontSize: "0.58rem", fontWeight: 700,
                    color: "rgba(180,200,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase",
                }}>{cur.num} of 05 — {cur.label}</span>
                {showPause && (
                    <button
                        onClick={() => setPaused(v => !v)}
                        style={{
                            fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.58rem",
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            background: "none", border: "none", cursor: "pointer",
                            color: "rgba(180,200,255,0.5)",
                        }}
                    >{paused ? "▶ Resume" : "⏸ Pause"}</button>
                )}
            </div>
        </div>
    );
}

/* ════ ABOUT PAGE ════ */
export default function AboutPage({ setPage, goToContactForm }) {
    const width = useWindowWidth();
    const sm = width <= 767;
    const md = width >= 768 && width <= 1023;
    const desktop = width >= 1024;

    const MQ1 = ["Hyderabad Based", "Web Development", "UI/UX Design", "App Development", "Clean Code", "Bold Design", "React & Next.js"];
    const MQ2 = ["React", "Next.js", "Flutter", "Django", "Figma", "WordPress", "Tailwind", "Node.js"];

    const WHY = [
        { icon: "🎯", title: "Direct access to the people building your product", desc: "When you message us, you hear back from the developer or designer actually working on your project — not a project manager passing notes along." },
        { icon: "💸", title: "Fixed quotes with full transparency", desc: "We agree on a scope and a price upfront. No scope creep charges, no surprise invoices. What we agree to is what you pay." },
        { icon: "⚡", title: "Efficient timelines without cutting corners", desc: "Focused teams mean fewer handoffs and faster decisions. Most projects move from brief to first design within days, not weeks." },
    ];

    /* Mobile: 5% sides (not 4%) so text breathes; desktop: 6% */
    const sectionPad = sm ? "2.8rem 5% 3rem" : md ? "3.5rem 5% 4rem" : "5rem 6%";

    return (
        <div style={{ width: "100%", minWidth: 0, paddingTop: 70 }}>

            {/* ══ HERO ══ */}
            <section style={{
                background: C.purpleDark,
                padding: sm ? "3rem 5% 3.5rem" : md ? "3.5rem 5% 4rem" : "5.5rem 6% 5rem",
                position: "relative", overflow: "hidden",
                backgroundImage: "radial-gradient(circle at 78% 28%, rgba(255, 0, 107,0.10), transparent 50%), radial-gradient(circle at 8% 85%, rgba(90, 157, 254,0.2), transparent 50%)",
                minHeight: sm ? 280 : md ? 340 : 400,
                display: "flex", alignItems: "center",
            }}>
                {!sm && (
                    <div style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: "clamp(5rem,18vw,15rem)",
                        color: "rgba(80,40,140,0.3)", lineHeight: 1,
                        userSelect: "none", pointerEvents: "none",
                        position: "absolute", top: "50%", right: "-2rem",
                        transform: "translateY(-50%)", whiteSpace: "nowrap", zIndex: 1,
                    }}>ABOUT</div>
                )}
                <div style={{
                    position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3,
                    background: "linear-gradient(180deg,transparent,#FF006B,transparent)",
                    borderRadius: "0 2px 2px 0",
                }} />
                <div style={{ position: "relative", zIndex: 2, maxWidth: 680, width: "100%" }}>
                    <Reveal><STag light>Who We Are</STag></Reveal>
                    <Reveal delay={0.06}>
                        <h1 style={{
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: sm ? "clamp(2.6rem,11vw,3.8rem)" : md ? "clamp(3.2rem,7vw,5rem)" : "clamp(4rem,7vw,6.5rem)",
                            color: C.cream, lineHeight: sm ? 1.05 : 0.92,
                            marginBottom: sm ? "1.2rem" : "1.4rem", letterSpacing: "0.01em",
                        }}>
                            BUILT ON<br />EXPERTISE.<br /><span style={{ color: C.coral }}>DRIVEN BY RESULTS.</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.12}>
                        <p style={{
                            color: "rgba(247,243,236,0.5)",
                            fontSize: sm ? "0.87rem" : "clamp(0.88rem,1.4vw,1rem)",
                            lineHeight: 1.85, maxWidth: 500,
                        }}>
                            Gugulotre is a web and product development team based in Hyderabad. We design and build websites, applications, and digital products for businesses that need things done properly — on time, on scope, and to a high standard.
                        </p>
                    </Reveal>
                    <Reveal delay={0.18}>
                        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: sm ? "1.4rem" : "2rem" }}>
                            {["Hyderabad, India", "100% In-House", "Full-Stack Capability", "No Middlemen"].map(t => (
                                <span key={t} style={{
                                    background: "rgba(56,135,253,0.12)",
                                    border: "1px solid rgba(56,135,253,0.35)",
                                    fontFamily: "'Syne',sans-serif", fontSize: "0.72rem", fontWeight: 700,
                                    padding: "0.3rem 0.9rem", borderRadius: 50,
                                    color: "#FF006B", letterSpacing: "0.06em",
                                }}>{t}</span>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            <Marquee items={MQ1} blue />

            {/* ══ ABOUT SECTION ══ */}
            <section style={{ background: C.cream, padding: sectionPad }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: desktop ? "1fr 1.4fr" : "1fr",
                    gap: sm ? "2rem" : md ? "2.5rem" : "4rem",
                    alignItems: "stretch",
                }}>
                    <Reveal style={{ height: "100%" }}>
                        <div style={{
                            background: `linear-gradient(145deg, ${C.purple} 0%, #2a0e5a 100%)`,
                            borderRadius: 24,
                            padding: sm ? "2rem" : "3rem",
                            position: "relative", overflow: "hidden",
                            boxSizing: "border-box",
                            display: "flex", flexDirection: "column", height: "100%",
                            boxShadow: "0 20px 60px rgba(47, 52, 144,0.25)",
                        }}>
                            {/* Orange accent line top */}
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.coral}, transparent)` }} />
                            <div style={{
                                position: "absolute", bottom: "-1.5rem", right: "-0.5rem",
                                fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(5rem,12vw,9rem)",
                                color: C.cream, opacity: 0.04,
                                userSelect: "none", pointerEvents: "none", lineHeight: 1,
                            }}>GT</div>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                background: "rgba(255, 0, 107,0.12)", border: "1px solid rgba(255, 0, 107,0.18)",
                                borderRadius: 50, padding: "0.35rem 0.9rem",
                                width: "fit-content", marginBottom: "2rem",
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.coral, animation: "breathe 2s ease infinite" }} />
                                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.65rem", fontWeight: 700, color: C.coral, letterSpacing: "0.12em", textTransform: "uppercase" }}>Our Approach</span>
                            </div>
                            <div style={{
                                fontFamily: "'Bebas Neue',sans-serif",
                                fontSize: sm ? "clamp(2.2rem,8vw,3.2rem)" : "clamp(2.5rem,5vw,4rem)",
                                color: "#fff", lineHeight: 0.9, marginBottom: "1.6rem", flex: 1,
                            }}>
                                TECHNICAL<br /><span style={{ color: C.coral }}>DEPTH.</span><br />
                                <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.35)", color: "transparent" }}>DESIGN</span><br />
                                CLARITY.
                            </div>
                            <p style={{ color: "rgba(247,243,236,0.5)", fontSize: "0.9rem", lineHeight: 1.85, maxWidth: 320, margin: 0 }}>
                                Every decision we make — from architecture choices to interface details — is grounded in the goal of delivering something that actually works for your business.
                            </p>
                        </div>
                    </Reveal>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem", justifyContent: "center" }}>
                        <Reveal>
                            <STag>What We Do</STag>
                            <h2 style={{
                                fontFamily: "'Bebas Neue',sans-serif",
                                fontSize: sm ? "clamp(1.6rem,6vw,2.4rem)" : "clamp(1.8rem,3.5vw,3rem)",
                                lineHeight: 1, color: C.ink, marginBottom: "1rem",
                            }}>
                                END-TO-END<br /><span style={{ color: C.coral }}>DIGITAL DELIVERY.</span>
                            </h2>
                            <div style={{ borderLeft: `2px solid ${C.creamDark}`, paddingLeft: "1rem", marginTop: "0.2rem" }}>
                                <p style={{ fontSize: "0.92rem", color: C.inkSoft, lineHeight: 1.85, marginBottom: "1rem", margin: "0 0 1rem 0" }}>
                                    We cover the full scope of digital product development — from research and design through to build, deployment, and ongoing support. Whether you need a marketing website, a web application, or a mobile product, we handle it with the same level of care and technical rigour.
                                </p>
                                <p style={{ fontSize: "0.92rem", color: C.inkSoft, lineHeight: 1.85, margin: 0 }}>
                                    Our team works across React, Next.js, Django, Flutter, and Figma — giving us the range to take on projects at any scale without bringing in external contractors or dependencies.
                                </p>
                            </div>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <div style={{
                                background: "#fff", borderRadius: 16,
                                padding: sm ? "1.2rem 1rem" : "1.6rem 1.5rem",
                                border: `1px solid ${C.creamDark}`,
                                boxShadow: "0 4px 18px rgba(47, 52, 144,0.05)",
                                borderTop: `3px solid ${C.coral}`,
                            }}>
                                <div style={{
                                    fontFamily: "'Syne',sans-serif", fontSize: "0.65rem", fontWeight: 700,
                                    letterSpacing: "0.12em", textTransform: "uppercase",
                                    color: C.inkSoft, marginBottom: "1rem",
                                }}>Our commitment on every project</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                    {[
                                        "Senior-level skills applied to every project regardless of size",
                                        "Direct communication with the people doing the work",
                                        "Fixed quotes agreed before any work begins",
                                        "Clean, documented code with full IP transferred to you",
                                        "Post-launch support and a clear handoff process",
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                                            <span style={{ color: C.coral, fontWeight: 700, flexShrink: 0 }}>→</span>
                                            <span style={{ fontSize: "0.87rem", color: C.ink, lineHeight: 1.6 }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={0.15}>
                            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                <button
                                    onClick={goToContactForm}
                                    onMouseEnter={e => { e.currentTarget.style.background = "#5A9DFE"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = C.purpleMid; e.currentTarget.style.transform = ""; }}
                                    style={{
                                        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.88rem",
                                        background: C.purpleMid, color: "#fff", border: "none", cursor: "pointer",
                                        padding: "0.88rem 1.9rem", borderRadius: 50,
                                        boxShadow: "0 4px 18px rgba(56, 135, 253,0.28)",
                                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                        transition: "all 0.22s", whiteSpace: "nowrap",
                                    }}>Start a Project</button>
                                <button
                                    onClick={() => setPage("Services")}
                                    onMouseEnter={e => { e.currentTarget.style.background = "#2e1260"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = C.purple; e.currentTarget.style.transform = ""; }}
                                    style={{
                                        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.88rem",
                                        cursor: "pointer", background: C.purple, color: "#fff",
                                        border: "none",
                                        padding: "0.88rem 1.9rem", borderRadius: 50,
                                        boxShadow: "0 4px 18px rgba(47, 52, 144,0.28)",
                                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                        transition: "all 0.22s", whiteSpace: "nowrap",
                                    }}>View Services</button>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══ WHY US ══ */}
            <section style={{ background: "#fff", padding: sectionPad }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: desktop ? "1fr 1.4fr" : "1fr",
                    gap: sm ? "2rem" : "4rem", alignItems: "center",
                }}>
                    <div>
                        <Reveal><STag>Why Work With Us</STag></Reveal>
                        <Reveal delay={0.06}>
                            <h2 style={{
                                fontFamily: "'Bebas Neue',sans-serif",
                                fontSize: sm ? "clamp(1.8rem,7vw,2.8rem)" : "clamp(2rem,4vw,3.4rem)",
                                color: C.ink, lineHeight: 1, marginBottom: "1rem",
                            }}>
                                FOCUSED TEAM.<br /><span style={{ color: C.coral }}>FULL ACCOUNTABILITY.</span>
                            </h2>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <div style={{ borderLeft: `2px solid ${C.creamDark}`, paddingLeft: "1rem" }}>
                                <p style={{ fontSize: "0.92rem", color: C.inkSoft, lineHeight: 1.85, margin: 0 }}>
                                    Working with a focused team means you get experienced people who are directly accountable for every decision — not layers of management between you and the work.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {WHY.map((item, i) => (
                            <Reveal key={item.title} delay={i * 0.08}>
                                <WhyCard {...item} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ HOW WE WORK ══ */}
            <HowWeWorkPanel sm={sm} md={md} desktop={desktop} />

            <Marquee items={MQ2} blue reverse />

            {/* ══ PROCESS SNAPSHOT ══ */}
            <section style={{ background: C.cream, padding: sectionPad }}>
                <Reveal>
                    <div style={{
                        background: "#fff", border: `1px solid ${C.creamDark}`,
                        borderRadius: sm ? 16 : 20,
                        padding: sm ? "2rem 1.4rem" : md ? "2.5rem" : "3rem 3.5rem",
                        position: "relative", overflow: "hidden",
                        boxShadow: "0 4px 24px rgba(47, 52, 144,0.06)",
                    }}>
                        <div style={{
                            position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
                            background: C.coral,
                            borderRadius: "4px 0 0 4px",
                        }} />
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: desktop ? "1fr 1fr" : "1fr",
                            gap: sm ? "1.5rem" : "3rem",
                            alignItems: "center",
                            paddingLeft: sm ? "1rem" : "1.5rem",
                        }}>
                            <div>
                                <STag>What to Expect</STag>
                                <h2 style={{
                                    fontFamily: "'Bebas Neue',sans-serif",
                                    fontSize: sm ? "clamp(1.6rem,6vw,2.2rem)" : "clamp(1.8rem,3vw,2.8rem)",
                                    color: C.ink, lineHeight: 1, marginBottom: "1rem",
                                }}>
                                    A PROCESS<br /><span style={{ color: C.coral }}>BUILT FOR CLARITY.</span>
                                </h2>
                                <p style={{ fontSize: "0.92rem", color: C.inkSoft, lineHeight: 1.85, marginBottom: "0.9rem" }}>
                                    We follow a structured process that keeps you informed at every stage — from the initial brief through to deployment and handoff.
                                </p>
                                <p style={{ fontSize: "0.92rem", color: C.inkSoft, lineHeight: 1.85 }}>
                                    You'll see work-in-progress at regular intervals, have clear input on direction, and receive documentation that makes your product easy to manage after launch.
                                </p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {[
                                    "Discovery call to define scope, timeline, and budget",
                                    "Design review before any code is written",
                                    "Build phase with regular milestone check-ins",
                                    "Deployment with full source code and handoff docs",
                                    "Post-launch support included as standard",
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        display: "flex", alignItems: "center", gap: "0.8rem",
                                        padding: "0.85rem 1rem",
                                        background: C.cream, borderRadius: 10,
                                        border: `1px solid ${C.creamDark}`,
                                    }}>
                                        <span style={{
                                            width: 28, height: 28, borderRadius: "50%",
                                            background: "rgba(255, 0, 107,0.1)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: C.coral, fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
                                        }}>✓</span>
                                        <span style={{
                                            fontFamily: "'Syne',sans-serif", fontWeight: 600,
                                            fontSize: "0.85rem", color: C.ink,
                                        }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* ══ CTA BANNER ══ */}
            <section style={{ background: C.creamDark, padding: sm ? "2.5rem 5%" : "4rem 6%" }}>
                <Reveal>
                    <div style={{
                        background: `linear-gradient(135deg, ${C.purpleDark} 0%, #3d1b6e 55%, #5930A8 100%)`,
                        borderRadius: sm ? 16 : 20,
                        padding: sm ? "2rem 1.6rem" : md ? "2.8rem" : "3.5rem 4rem",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap", gap: "2rem",
                        position: "relative", overflow: "hidden",
                        borderTop: `3px solid ${C.coral}`,
                    }}>
                        <div style={{
                            position: "absolute", top: "-2rem", right: "8rem",
                            width: 260, height: 260, borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(255, 0, 107,0.18), transparent 65%)",
                            pointerEvents: "none",
                        }} />
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <h2 style={{
                                fontFamily: "'Bebas Neue',sans-serif",
                                fontSize: sm ? "clamp(2rem,7vw,2.8rem)" : "clamp(2.2rem,4.5vw,3.6rem)",
                                color: "#fff", lineHeight: sm ? 1.05 : 0.95, marginBottom: "0.8rem",
                            }}>
                                READY TO GET STARTED?<br /><span style={{ color: C.coral }}>LET'S TALK.</span>
                            </h2>
                            <p style={{
                                color: "rgba(247,243,236,0.5)", fontSize: "0.95rem",
                                lineHeight: 1.7, maxWidth: 420, margin: 0,
                            }}>
                                Book a free introductory call. Tell us about your project and we'll outline how we can help — no obligation.
                            </p>
                        </div>
                        <button
                            onClick={goToContactForm}
                            onMouseEnter={e => { e.currentTarget.style.background = "#5A9DFE"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(56, 135, 253,0.5)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = C.purpleMid; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 24px rgba(56, 135, 253,0.35)"; }}
                            style={{
                                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem",
                                background: C.purpleMid, color: "#fff", border: "none",
                                padding: "1rem 2.4rem", borderRadius: 50, cursor: "pointer",
                                transition: "all 0.25s",
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                boxShadow: "0 6px 24px rgba(56, 135, 253,0.35)",
                                position: "relative", zIndex: 1, whiteSpace: "nowrap",
                                width: sm ? "100%" : "auto",
                                justifyContent: sm ? "center" : "flex-start",
                            }}>
                            Book a Free Call
                        </button>
                    </div>
                </Reveal>
            </section>

            <style>{`
                @keyframes breathe { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
                @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
                @keyframes marqueeRev { from{transform:translateX(-33.333%)} to{transform:translateX(0)} }
            `}</style>
        </div>
    );
}