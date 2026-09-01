import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { C } from "../components/theme";

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
            ...style,
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
        <div style={{ background: coral ? C.coral : blue ? C.purpleMid : C.creamDark, padding: "0.85rem 0", overflow: "hidden" }}>
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
        </div>
    );
}

// Add this lookup above the StepCard component (outside it)
const STEP_BADGES = {
    "01": ["🎯 Goal-Driven", "📋 Documented", "🤝 Collaborative"],
    "02": ["✏️ Figma-First", "🖼️ Hi-Fi Ready", "🔄 Revision-Friendly"],
    "03": ["🔗 Live Previews", "🧱 Clean Code", "⚙️ Sprint-Based"],
    "04": ["🌐 Cross-Browser", "♿ Accessible", "⚡ Lighthouse 90+"],
    "05": ["📦 Full Source", "📄 Documented", "🚀 Production-Ready"],
};

/* ════ STEP DATA ════ */
const STEPS = [
    {
        num: "01", phase: "Discovery", icon: "🔍",
        title: "Strategy Call",
        desc: "We map your goals, audience, and full project scope in a focused session. Everything aligned before any work begins.",
        details: ["Goals & scope defined", "Tech stack agreed", "Full brief documented"],
    },
    {
        num: "02", phase: "Design", icon: "🎨",
        title: "Design Sprint",
        desc: "Figma wireframes and full visual designs delivered and approved by you before a single line of code is written.",
        details: ["Wireframes first", "Hi-fi Figma mockups", "Design system ready"],
    },
    {
        num: "03", phase: "Build", icon: "⚙️",
        title: "Build & Iterate",
        desc: "Focused sprints with live staging links shared at every milestone. Real progress, real communication.",
        details: ["Live preview links", "Sprint check-ins", "Clean architecture"],
    },
    {
        num: "04", phase: "QA", icon: "✅",
        title: "Test & Polish",
        desc: "Cross-device testing, performance audits, accessibility checks. We do not ship until it is genuinely excellent.",
        details: ["Cross-browser tested", "Lighthouse audits", "Accessibility checks"],
    },
    {
        num: "05", phase: "Launch", icon: "🚀",
        title: "Deploy & Handoff",
        desc: "Full deployment handled end-to-end. Full source code, documentation, and a clean handoff to your team.",
        details: ["Deployment handled", "Full source code", "Docs & training"],
    },
];

/* ════ STEP CARD ════ */
function StepCard({ step, index, isActive, isCurrent, isLeft, isMobile, isTablet }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    const [hov, setHov] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
            { threshold: 0.05 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const slideDir = isMobile ? 0 : (isLeft ? -36 : 36);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                opacity: vis ? 1 : 0,
                transform: vis ? "translateX(0)" : `translateX(${slideDir}px)`,
                transition: `opacity 0.55s ease ${index * 0.05}s, transform 0.55s ease ${index * 0.05}s`,
            }}
        >
            <div style={{
                background: "#fff",
                borderRadius: isMobile ? 14 : 20,
                border: `1.5px solid ${isActive ? C.coral : C.creamDark}`,
                padding: isMobile ? "1rem 1rem" : isTablet ? "1.5rem 1.8rem" : "2rem 2.4rem",
                position: "relative",
                overflow: "hidden",
                boxShadow: isCurrent
                    ? `0 10px 40px rgba(255, 0, 107,0.13), 0 2px 12px rgba(47, 52, 144,0.06)`
                    : hov ? `0 8px 28px rgba(47, 52, 144,0.09)` : `0 2px 10px rgba(47, 52, 144,0.04)`,
                transition: "all 0.4s ease",
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1.3fr",
                gap: isMobile ? "0.85rem" : "2rem",
                alignItems: "center",
            }}>
                {/* Left accent bar */}
                <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: isActive ? 4 : 0,
                    background: `linear-gradient(180deg, ${C.coral}, ${C.purple})`,
                    borderRadius: "0 2px 2px 0",
                    transition: "width 0.4s ease",
                }} />
                {/* Top glow */}
                {isCurrent && (
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 2,
                        background: `linear-gradient(90deg, transparent, ${C.coral}, transparent)`,
                        animation: "glowPulse 2s ease infinite",
                    }} />
                )}
                {/* Ghost number */}
                <div style={{
                    position: "absolute",
                    top: "-0.3rem",
                    right: "0.6rem",
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: isMobile ? "3.5rem" : "6rem",
                    color: isActive ? C.purple : C.creamDark,
                    opacity: isActive ? 0.055 : 0.45,
                    lineHeight: 1, userSelect: "none", pointerEvents: "none",
                    transition: "opacity 0.4s, color 0.4s",
                }}>{step.num}</div>

                {/* LEFT col */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.65rem" }}>
                        <div style={{
                            width: isMobile ? 34 : 46,
                            height: isMobile ? 34 : 46,
                            borderRadius: 10, flexShrink: 0,
                            background: isActive ? "rgba(255, 0, 107,0.07)" : C.creamDark,
                            border: `1.5px solid ${isActive ? "rgba(255, 0, 107,0.15)" : C.creamDark}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: isMobile ? "1rem" : "1.35rem",
                            animation: isCurrent ? "iconFloat 3s ease infinite" : "none",
                            transition: "all 0.4s",
                        }}>{step.icon}</div>
                        <span style={{
                            fontFamily: "'Syne',sans-serif",
                            fontSize: isMobile ? "0.55rem" : "0.6rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em", textTransform: "uppercase",
                            background: isActive ? "rgba(255, 0, 107,0.07)" : C.creamDark,
                            color: isActive ? C.coral : C.inkSoft,
                            padding: "0.18rem 0.6rem", borderRadius: 50,
                            border: `1px solid ${isActive ? "rgba(255, 0, 107,0.15)" : C.creamDark}`,
                            transition: "all 0.4s",
                        }}>{step.phase}</span>
                    </div>
                    <div style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: isMobile ? "1.15rem" : isTablet ? "1.7rem" : "clamp(1.6rem,2.6vw,2.3rem)",
                        color: isActive ? C.ink : C.inkSoft,
                        lineHeight: 1.05, marginBottom: "0.5rem",
                        opacity: isActive ? 1 : 0.38,
                        transition: "all 0.4s",
                    }}>
                        <span style={{ color: C.coral, marginRight: "0.25rem" }}>{step.num}</span>{step.title}
                    </div>
                    <p style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: isMobile ? "0.75rem" : "0.87rem",
                        color: isActive ? C.inkSoft : "rgba(0,0,0,0.28)",
                        lineHeight: 1.7, margin: 0,
                        transition: "color 0.4s",
                    }}>{step.desc}</p>
                </div>

                {/* RIGHT col — checklist + badges */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {step.details.map((d, di) => (
                        <div key={d} style={{
                            background: isActive ? "rgba(255, 0, 107,0.04)" : C.creamDark,
                            border: `1px solid ${isActive ? "rgba(255, 0, 107,0.1)" : C.creamDark}`,
                            borderLeft: `3px solid ${isActive ? C.coral : C.creamDark}`,
                            borderRadius: "0 10px 10px 0",
                            padding: isMobile ? "0.38rem 0.6rem" : "0.58rem 0.85rem",
                            fontFamily: "'Syne',sans-serif", fontWeight: 600,
                            fontSize: isMobile ? "0.68rem" : "0.77rem",
                            color: isActive ? C.ink : C.inkSoft,
                            display: "flex", alignItems: "center", gap: "0.45rem",
                            opacity: isActive ? 1 : 0.38,
                            transform: isActive ? "translateX(0)" : "translateX(-8px)",
                            transition: `all 0.4s ease ${di * 0.07}s`,
                        }}>
                            <span style={{ color: C.coral, fontWeight: 800, opacity: isActive ? 1 : 0.25, transition: "opacity 0.4s", flexShrink: 0 }}>✓</span>{d}
                        </div>
                    ))}

                    <div style={{
                        display: "grid", gridTemplateColumns: "repeat(3,1fr)",
                        gap: "0.32rem", marginTop: "0.4rem",
                    }}>
                        {(STEP_BADGES[step.num] || ["⚡ Fast", "🔒 Transparent", "📈 Scalable"]).map((label, bi) => (
                            <div key={label} style={{
                                background: isActive
                                    ? `linear-gradient(135deg, rgba(255, 0, 107,0.06), rgba(47, 52, 144,0.06))`
                                    : C.creamDark,
                                border: `1px solid ${isActive ? "rgba(255, 0, 107,0.18)" : C.creamDark}`,
                                borderTop: isActive ? `2px solid ${C.coral}` : `2px solid transparent`,
                                borderRadius: 8,
                                padding: isMobile ? "0.32rem 0.08rem" : "0.45rem 0.25rem",
                                fontFamily: "'Syne',sans-serif",
                                fontSize: isMobile ? "0.46rem" : "0.55rem",
                                fontWeight: 700,
                                color: isActive ? C.purple : C.inkSoft,
                                textAlign: "center",
                                letterSpacing: "0.02em",
                                opacity: isActive ? 1 : 0.3,
                                transform: isActive ? "translateY(0)" : "translateY(4px)",
                                boxShadow: isActive ? "0 2px 8px rgba(255, 0, 107,0.08)" : "none",
                                transition: `all 0.4s ease ${0.15 + bi * 0.06}s`,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "0.15rem",
                            }}>
                                {/* Split emoji and text for better visual weight */}
                                <span style={{ fontSize: isMobile ? "0.7rem" : "0.85rem", lineHeight: 1 }}>
                                    {label.split(" ")[0]}
                                </span>
                                <span style={{ lineHeight: 1.2 }}>
                                    {label.split(" ").slice(1).join(" ")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


function CardConnector({ fromLeft, toLeft, fillPct, containerWidth, isMobileWidth, isTabletWidth }) {
    // Figure out center-x for start and end based on card alignment
    const cardPct = isMobileWidth ? 1.0 : isTabletWidth ? 0.80 : 0.63;
    const leftCX = containerWidth * (cardPct / 2);
    const rightCX = containerWidth * (1 - cardPct / 2);

    const startX = fromLeft ? leftCX : rightCX;
    const endX = toLeft ? leftCX : rightCX;

    const H = isMobileWidth ? 80 : 110;

    if (isMobileWidth) {
        // ── MOBILE: simple vertical bar with a growing fill overlay ──
        const centerX = startX; // same as endX on mobile
        const trackW = 4;
        return (
            <div style={{ width: "100%", height: H, position: "relative", pointerEvents: "none" }}>
                {/* ghost track */}
                <div style={{
                    position: "absolute",
                    left: centerX - trackW / 2,
                    top: 0,
                    width: trackW,
                    height: H,
                    background: "#E8E0D5",
                    borderRadius: 4,
                }} />
                {/* fill */}
                <div style={{
                    position: "absolute",
                    left: centerX - trackW / 2,
                    top: 0,
                    width: trackW,
                    height: `${fillPct}%`,
                    background: "linear-gradient(180deg, #FF006B, #5A9DFE)",
                    borderRadius: 4,
                    boxShadow: fillPct > 0 ? "0 0 8px rgba(255, 0, 107,0.5)" : "none",
                    transition: "height 0.5s ease-out",
                }} />
            </div>
        );
    }

    // ── TABLET / DESKTOP: SVG S-curve ──
    const pathD = `M ${startX} 0 C ${startX} ${H * 0.6}, ${endX} ${H * 0.4}, ${endX} ${H}`;
    const gradId = `grad-${fromLeft ? 0 : 1}-${toLeft ? 0 : 1}`;
    // Approximate path length: straight-line distance + curve factor
    const dx = Math.abs(endX - startX);
    const approxLen = Math.sqrt(dx * dx + H * H) * 1.2 + 40;

    return (
        <div style={{ width: "100%", height: H, pointerEvents: "none" }}>
            <svg width={containerWidth} height={H} style={{ display: "block", overflow: "visible" }}>
                <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF006B" />
                        <stop offset="100%" stopColor="#5A9DFE" />
                    </linearGradient>
                </defs>
                {/* Ghost track */}
                <path d={pathD} fill="none" stroke="#E8E0D5" strokeWidth="6" strokeLinecap="round" />
                {/* Animated fill */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={approxLen}
                    strokeDashoffset={approxLen - (fillPct / 100) * approxLen}
                    style={{
                        filter: "drop-shadow(0 0 5px rgba(255, 0, 107,0.5))",
                        transition: "stroke-dashoffset 0.5s ease-out",
                    }}
                />
            </svg>
        </div>
    );
}

/* ════ UNIFIED PIPELINE ════ */
function Pipeline() {
    const wrapRef = useRef(null);
    const cardRefs = useRef([]);
    const [activeStep, setActiveStep] = useState(null);
    const [connFills, setConnFills] = useState(Array(STEPS.length - 1).fill(0));
    const [containerW, setContainerW] = useState(960);
    const [screenW, setScreenW] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1200
    );

    // Measure container & screen width
    useEffect(() => {
        const measure = () => {
            if (wrapRef.current) setContainerW(wrapRef.current.offsetWidth);
            setScreenW(window.innerWidth);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // Scroll handler
    useEffect(() => {
        const onScroll = () => {
            const wh = window.innerHeight;
            const triggerY = wh * (screenW < 540 ? 0.88 : screenW < 780 ? 0.72 : 0.62);

            let current = null;
            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                if (el.getBoundingClientRect().top < triggerY) current = i;
            });
            setActiveStep(current);

            const fills = STEPS.slice(0, -1).map((_, i) => {
                if (current === null || i > current) return 0;
                if (i < current) return 100;
                const el = cardRefs.current[i];
                const nxt = cardRefs.current[i + 1];
                if (!el || !nxt) return 100;
                const elBottom = el.getBoundingClientRect().bottom;
                const nxtTop = nxt.getBoundingClientRect().top;
                const travel = nxtTop - elBottom;
                const gone = triggerY - elBottom;
                if (travel <= 0) return 100;
                return Math.min(100, Math.max(0, (gone / travel) * 100));
            });
            setConnFills(fills);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [screenW]);

    const isMobile = screenW < 540;
    const isTablet = screenW >= 540 && screenW < 780;
    const cardWidth = isMobile ? "100%" : isTablet ? "80%" : "63%";

    return (
        <div id="process-pipeline" style={{ background: C.cream, padding: isMobile ? "1.8rem 3.5% 3rem" : "3rem 5% 5rem" }}>
            <div
                ref={wrapRef}
                style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 960, margin: "0 auto" }}
            >
                {STEPS.map((step, i) => {
                    const isLeft = isMobile ? true : i % 2 === 0;
                    const isActive = activeStep !== null && i <= activeStep;
                    const isCurrent = activeStep === i;

                    return (
                        <div key={step.num}>
                            <div style={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-end" }}>
                                <div ref={el => cardRefs.current[i] = el} style={{ width: cardWidth }}>
                                    <StepCard
                                        step={step} index={i}
                                        isActive={isActive} isCurrent={isCurrent}
                                        isLeft={isLeft}
                                        isMobile={isMobile} isTablet={isTablet}
                                    />
                                </div>
                            </div>

                            {i < STEPS.length - 1 && (
                                <CardConnector
                                    fromLeft={isLeft}
                                    toLeft={isMobile ? true : !isLeft}
                                    fillPct={connFills[i] ?? 0}
                                    containerWidth={containerW}
                                    isMobileWidth={isMobile}
                                    isTabletWidth={isTablet}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ════ HERO ════ */
function ProcessHero({ setPage, goToContactForm }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);
    return (
        <section style={{
            background: C.purpleDark, padding: "5rem 5%",
            position: "relative", overflow: "hidden",
            minHeight: 400, display: "flex", alignItems: "center",
            backgroundImage: "radial-gradient(circle at 80% 30%, rgba(255, 0, 107,0.10), transparent 55%), radial-gradient(circle at 10% 90%, rgba(90, 157, 254,0.18), transparent 50%)",
        }}>
            <div style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(5rem,18vw,15rem)",
                color: "rgba(80,40,140,0.3)", lineHeight: 1,
                userSelect: "none", pointerEvents: "none",
                position: "absolute", top: "50%", right: "-3rem",
                transform: "translateY(-50%)", whiteSpace: "nowrap", zIndex: 1,
            }}>PROCESS</div>
            <div style={{
                position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3,
                background: "linear-gradient(180deg, transparent, #FF006B, transparent)",
                borderRadius: "0 2px 2px 0",
            }} />
            <div style={{ position: "relative", zIndex: 2, maxWidth: 680, width: "100%" }}>
                <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease 0.1s" }}>
                    <STag light>How We Work</STag>
                </div>
                <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease 0.2s" }}>
                    <h1 style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: "clamp(3.5rem,8vw,7rem)",
                        color: C.cream, lineHeight: 0.92, marginBottom: "1.4rem",
                    }}>
                        FROM IDEA<br />
                        TO <span style={{ color: "transparent", WebkitTextStroke: `2px ${C.purpleSoft}` }}>LIVE</span><br />
                        <span style={{ color: C.coral }}>PRODUCT.</span>
                    </h1>
                </div>
                <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease 0.35s" }}>
                    <p style={{
                        color: "rgba(247,243,236,0.5)",
                        fontSize: "clamp(0.88rem,1.4vw,1rem)",
                        lineHeight: 1.85, maxWidth: 480, marginBottom: "2rem",
                    }}>
                        We don't just ship code — we build with clarity, communication, and craftsmanship. Every stage below is a commitment we make to you.
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        <button
                            onClick={goToContactForm}
                            onMouseEnter={e => { e.currentTarget.style.background = "#5A9DFE"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = C.purpleMid; e.currentTarget.style.transform = ""; }}
                            style={{
                                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem",
                                background: C.purpleMid, color: "#fff", border: "none", cursor: "pointer",
                                padding: "0.88rem 1.9rem", borderRadius: 50,
                                boxShadow: "0 4px 18px rgba(56, 135, 253,0.28)",
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                transition: "all 0.22s",
                            }}>Start a Project</button>
                        <button
                            onClick={() => setPage("Services")}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.38)"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.color = "rgba(247,243,236,0.6)"; }}
                            style={{
                                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem",
                                background: "transparent", color: "rgba(247,243,236,0.6)", cursor: "pointer",
                                border: "1.5px solid rgba(255,255,255,0.16)",
                                padding: "0.88rem 1.9rem", borderRadius: 50,
                                transition: "all 0.22s",
                            }}>View Services</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ════ CTA ════ */
function ProcessCTA({ setPage, goToContactForm }) {
    const [screenW, setScreenW] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1200
    );
    useEffect(() => {
        const handleResize = () => setScreenW(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const sm = screenW < 540;

    return (
        <section style={{ background: C.creamDark, padding: sm ? "2.5rem 5%" : "4rem 5%" }}>
            <Reveal>
                <div style={{
                    background: `linear-gradient(135deg, ${C.purpleDark} 0%, #3d1b6e 55%, #5930A8 100%)`,
                    borderRadius: sm ? 16 : 20,
                    padding: sm ? "2rem 1.6rem" : "3.5rem 4rem",
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
                            color: "rgba(247,243,236,0.5)", fontSize: "0.9rem",
                            lineHeight: 1.7, maxWidth: 400, margin: 0,
                        }}>
                            Book a free strategy call. Tell us about your project and we will outline the best approach — no commitment required.
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
                            flexShrink: 0,
                            width: sm ? "100%" : "auto",
                            justifyContent: sm ? "center" : "flex-start",
                        }}>
                        Book a Free Call
                    </button>
                </div>
            </Reveal>
        </section>
    );
}

/* ════ ROOT ════ */
export default function ProcessPage({ setPage, goToContactForm, targetSection, onSectionHandled }) {
    useLayoutEffect(() => {
        if (!targetSection) return;
        const el = document.getElementById(targetSection);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: "instant" });
        }
        onSectionHandled?.();
    }, [targetSection]);
    const MQ = ["Discovery", "Design Sprint", "Build & Iterate", "QA & Testing", "Deploy & Handoff", "Clean Code", "Pixel Perfect", "Transparent Process"];
    return (
        <div style={{ width: "100%", paddingTop: 70 }}>
            <ProcessHero setPage={setPage} goToContactForm={goToContactForm} />
            <Marquee items={MQ} blue />
            <Pipeline />
            <Marquee items={MQ} blue reverse />
            <ProcessCTA setPage={setPage} goToContactForm={goToContactForm} />
            <style>{`
                @keyframes marquee    { from{transform:translateX(0)}        to{transform:translateX(-33.333%)} }
                @keyframes marqueeRev { from{transform:translateX(-33.333%)} to{transform:translateX(0)} }
                @keyframes iconFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                @keyframes glowPulse  { 0%,100%{opacity:0.55} 50%{opacity:1} }
            `}</style>
        </div>
    );
}