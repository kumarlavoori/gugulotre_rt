import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { C } from "../components/theme";

/* ════ REVEAL ════ */
function Reveal({ children, delay = 0, style = {} }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`, ...style }}>
            {children}
        </div>
    );
}

/* ════ MARQUEE ════ */
function Marquee({ items, coral = false, blue = false, reverse = false }) {
    const tripled = [...items, ...items, ...items];
    return (
        <div style={{ background: coral ? C.coral : blue ? C.purpleMid : C.creamDark, padding: "0.85rem 0", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: "2.5rem", whiteSpace: "nowrap", width: "max-content", animation: `${reverse ? "marqueeRev" : "marquee"} 32s linear infinite` }}>
                {tripled.map((item, i) => (
                    <span key={i} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.76rem", color: (coral || blue) ? "rgba(255,255,255,0.85)" : C.inkSoft, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
                        {item}<span style={{ color: (coral || blue) ? "rgba(255,255,255,0.45)" : C.coral, fontSize: "0.45rem" }}>●</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ════ SECTION TAG ════ */
function STag({ children, light = false }) {
    return (
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: light ? "rgba(247,243,236,0.45)" : C.inkSoft, display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.1rem" }}>
            <span style={{ width: 20, height: 2, background: C.coral, display: "inline-block", flexShrink: 0 }} />
            {children}
        </div>
    );
}

/* ════ SCAN LINE ════ */
function ScanLine() {
    return (
        <div style={{
            position: "absolute", left: 0, width: "100%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255, 0, 107,0.12), transparent)",
            pointerEvents: "none", zIndex: 3,
            animation: "svcScanLine 4s linear infinite",
        }} />
    );
}

/* ════ SERVICE EXPLORER ════ */
function ServiceExplorer({ setPage, targetService, onServiceHandled, goToContactForm }) {

    const SERVICES = [
        {
            id: "web", num: "01", name: "Web Development", icon: "🌐",
            tag: "Websites & Web Apps",
            iconBg: "rgba(47, 52, 144,0.08)",
            desc: "Pixel-perfect, blazing-fast websites and web apps built with React, Next.js, and Django — engineered for SEO, speed, and conversion from day one. Clean architecture that scales with your business.",
            techs: ["React", "Next.js", "Django", "Python", "Node.js", "TypeScript", "PostgreSQL", "MySQL", "Tailwind CSS", "REST APIs", "GraphQL", "Redis", "Docker", "AWS", "Nginx", "Git"],
            deliverables: ["Fully responsive website or web app", "SEO-optimised page structure", "CMS integration if needed", "Performance audit & optimisation", "Full source code + deployment"],
        },
        {
            id: "uiux", num: "02", name: "UI / UX Design", icon: "🎨",
            tag: "Design Systems & Prototypes",
            iconBg: "rgba(255, 0, 107,0.07)",
            desc: "Design-first sprints in Figma. User flows, wireframes, and full visual systems — every decision backed by UX research and conversion principles. You see everything before we write a line of code.",
            techs: ["Figma", "FigJam", "Adobe XD", "Illustrator", "Photoshop", "Prototyping", "Wireframing", "Design Systems", "User Research", "A/B Testing", "Accessibility (WCAG)", "Motion Design", "Lottie", "Zeplin", "Storybook"],
            deliverables: ["User flow diagrams", "Lo-fi to hi-fi wireframes", "Full Figma design system", "Interactive prototype", "Handoff-ready component library"],
        },
        {
            id: "app", num: "03", name: "App Development", icon: "📱",
            tag: "iOS & Android",
            iconBg: "rgba(0,160,100,0.07)",
            desc: "One codebase, two platforms. Cross-platform iOS and Android apps with Flutter and React Native that feel native, run fast, and look stunning. From MVP to full App Store launch.",
            techs: ["Flutter", "React Native", "Dart", "Swift", "Kotlin", "Firebase", "Supabase", "REST APIs", "GraphQL", "Push Notifications", "In-App Purchases", "Google Maps SDK", "Stripe SDK", "App Store Connect", "Play Console", "Fastlane"],
            deliverables: ["Cross-platform iOS & Android app", "Firebase or backend integration", "App Store & Play Store submission", "Push notification setup", "Post-launch bug fix period"],
        },
        {
            id: "ecom", num: "04", name: "E-Commerce Stores", icon: "🛒",
            tag: "Conversion-Optimised Stores",
            iconBg: "rgba(56,135,253,0.07)",
            desc: "Stores engineered to convert — fast product pages, frictionless checkout, and all the integrations your fulfilment team needs. WooCommerce or fully custom — every detail drives sales.",
            techs: ["WooCommerce", "Shopify", "Next.js Commerce", "Stripe", "Razorpay", "PayPal", "UPI / PayU", "Inventory Management", "Shiprocket API", "Google Analytics 4", "Meta Pixel", "Mailchimp", "Klaviyo", "Hotjar", "CDN"],
            deliverables: ["Full storefront with product pages", "Payment gateway integration", "Order & inventory management", "Cart abandonment setup", "Performance & conversion audit"],
        },
        {
            id: "wp", num: "05", name: "WordPress & CMS", icon: "⚡",
            tag: "Manageable Platforms",
            iconBg: "rgba(47, 52, 144,0.08)",
            desc: "Custom WordPress themes and plugins from scratch — no bloated page builders. Fast, clean, exactly on-brand. Headless CMS setups available for teams that need editorial flexibility at developer speed.",
            techs: ["WordPress", "WooCommerce", "ACF Pro", "CPT UI", "Elementor (custom)", "Gutenberg Blocks", "REST API", "WP GraphQL", "Sanity", "Contentful", "Strapi", "Yoast SEO", "Cloudflare CDN", "WP Rocket", "Multisite"],
            deliverables: ["Custom theme from scratch", "Plugin development if needed", "Admin training session", "SEO plugin setup", "Speed optimisation & CDN"],
        },
        {
            id: "gd", num: "06", name: "Graphic Design", icon: "✏️",
            tag: "Branding & Visual Identity",
            iconBg: "rgba(255,0,107,0.08)",
            desc: "Bold logos, full brand identities, marketing materials, and print-ready assets — every visual crafted to make your brand instantly recognisable and impossible to ignore.",
            techs: ["Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign", "Figma", "After Effects", "Canva Pro", "CorelDRAW", "Brand Guidelines", "Typography Systems", "Colour Theory", "Print Design", "Social Media Kits", "Pitch Deck Design", "Packaging Design", "Vector Art"],
            deliverables: ["Logo & brand identity system", "Brand style guide (colours, fonts, rules)", "Social media design kit", "Marketing & print collateral", "Full source files in all formats"],
        },
    ];

    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const [animKey, setAnimKey] = useState(0);
    const [iconFloat, setIconFloat] = useState(true);

    useEffect(() => {
        if (!targetService) return;
        const idx = SERVICES.findIndex(s => s.id === targetService);
        if (idx !== -1) {
            setActive(idx);
            setAnimKey(k => k + 1);
            setPaused(true);
            setIconFloat(false);
            setTimeout(() => setIconFloat(true), 50);
        }
        onServiceHandled();
    }, [targetService]);

    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => {
            setActive(v => (v + 1) % SERVICES.length);
            setAnimKey(k => k + 1);
        }, 5000);
        return () => clearInterval(t);
    }, [paused]);

    const handleSelect = (i) => {
        setActive(i);
        setAnimKey(k => k + 1);
        setPaused(true);
        setIconFloat(false);
        setTimeout(() => setIconFloat(true), 50);
    };

    const cur = SERVICES[active];

    return (
        <section id="service-explorer" style={{ background: C.cream, padding: "5rem 0 0" }}>
            <div style={{ padding: "0 5% 3rem" }}>
                <Reveal><STag>Everything We Build</STag></Reveal>
                <Reveal delay={0.08}>
                    <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 0.95, color: C.ink }}>
                        SIX SERVICES.<br /><span style={{ color: C.coral }}>ONE CREATIVE SPACE.</span>
                    </h2>
                </Reveal>
            </div>

            <div id="svc-explorer-grid" style={{ padding: "0 5%" }}>
                <div className="svc-explorer-grid">
                    <div className="svc-explorer-list">
                        {SERVICES.map((s, i) => (
                            <button
                                key={s.id}
                                id={`svc-${s.id}`}
                                data-hover
                                onClick={() => handleSelect(i)}
                                className="svc-list-row"
                                style={{
                                    borderLeft: `3px solid ${active === i ? C.coral : "transparent"}`,
                                    background: active === i ? "#fff" : "transparent",
                                    boxShadow: active === i ? "inset 0 0 0 1px rgba(255, 0, 107,0.07)" : "none",
                                    fontFamily: "inherit",
                                }}
                            >
                                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255, 0, 107,0.05), transparent)", opacity: active === i ? 1 : 0, transition: "opacity 0.3s", pointerEvents: "none" }} />
                                <span style={{ background: active === i ? C.coral : "transparent", borderRadius: 6, padding: active === i ? "2px 6px" : "2px 2px", transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)", flexShrink: 0 }}>
                                    <span className="svc-list-num" style={{ color: active === i ? "#fff" : "rgba(92, 95, 135,0.45)" }}>{s.num}</span>
                                </span>
                                <div className="svc-list-meta">
                                    <span className="svc-list-name" style={{ color: active === i ? C.purple : C.ink }}>{s.name}</span>
                                    <span className="svc-list-tag" style={{ opacity: active === i ? 1 : 0.6, color: active === i ? C.coral : C.inkSoft }}>{s.tag}</span>
                                </div>
                                <span className="svc-list-arrow" style={{ opacity: active === i ? 1 : 0, transform: active === i ? "translateX(0)" : "translateX(-6px)", color: C.coral }}>→</span>
                            </button>
                        ))}
                    </div>

                    <div className="svc-explorer-panel" key={animKey}
                        onClick={() => setPaused(v => !v)}
                        style={{
                            cursor: "none",
                            userSelect: "none",
                            backgroundImage: "radial-gradient(circle at 88% 10%, rgba(255, 0, 107,0.05) 0%, transparent 45%), radial-gradient(circle at 8% 88%, rgba(47, 52, 144,0.05) 0%, transparent 45%)"
                        }}>
                        <ScanLine />
                        <div style={{ position: "absolute", top: "-1rem", right: "1.5rem", fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(5rem,10vw,9rem)", color: C.purple, opacity: 0.04, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{cur.num}</div>

                        {/* ── Pause/Play hint badge ── */}


                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.2rem", position: "relative", zIndex: 2 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: cur.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0, animation: iconFloat ? "svcIconFloat 3s ease infinite" : "none" }}>{cur.icon}</div>
                            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: "rgba(255, 0, 107,0.09)", border: "1.5px solid rgba(255, 0, 107,0.22)", color: "#B8004F", padding: "0.22rem 0.75rem", borderRadius: 50 }}>{cur.tag}</span>
                        </div>

                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2rem,4vw,3.5rem)", color: C.ink, lineHeight: 1, marginBottom: "1rem", letterSpacing: "0.01em", position: "relative", zIndex: 2 }}>{cur.name}</div>
                        <p style={{ fontSize: "0.92rem", color: C.inkSoft, lineHeight: 1.85, marginBottom: "1.8rem", position: "relative", zIndex: 2 }}>{cur.desc}</p>

                        <div className="svc-panel-cols" style={{ position: "relative", zIndex: 2 }}>
                            <div>
                                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkSoft, marginBottom: "0.9rem" }}>What's Included</div>
                                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                                    {cur.deliverables.map((d, i) => (
                                        <li key={d} className="svc-deliverable-item" style={{ animationDelay: `${i * 0.06}s` }}>
                                            <span style={{ color: C.coral, fontWeight: 700, flexShrink: 0, marginRight: "0.5rem" }}>→</span>
                                            <span style={{ fontSize: "0.85rem", color: C.ink, lineHeight: 1.5 }}>{d}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkSoft, marginBottom: "0.9rem" }}>Tech Stack</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                                    {cur.techs.map((t, i) => (
                                        <span key={t} className="svc-tech-pill" style={{ animationDelay: `${i * 0.05}s` }}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="svc-panel-bottom" style={{ position: "relative", zIndex: 2 }}>
                            <div style={{ flex: 1, minWidth: 120 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.62rem", fontWeight: 700, color: C.inkSoft, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                        {active + 1} / {SERVICES.length}
                                    </span>

                                    {/* ── hint badge inline above progress bar ── */}
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: "0.3rem",
                                        background: paused ? "rgba(255, 0, 107,0.10)" : "rgba(92, 95, 135,0.07)",
                                        border: `1px solid ${paused ? "rgba(255, 0, 107,0.25)" : "rgba(92, 95, 135,0.12)"}`,
                                        borderRadius: 50, padding: "0.2rem 0.55rem 0.2rem 0.4rem",
                                        transition: "all 0.35s ease",
                                        animation: paused ? "none" : "hintPulse 3s ease infinite",
                                        pointerEvents: "none",
                                    }}>
                                        <span style={{ fontSize: "0.5rem", color: paused ? C.coral : C.inkSoft, opacity: paused ? 1 : 0.5, transition: "all 0.35s", lineHeight: 1 }}>
                                            {paused ? "▶" : "⏸"}
                                        </span>
                                        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.48rem", letterSpacing: "0.08em", textTransform: "uppercase", color: paused ? C.coral : C.inkSoft, opacity: paused ? 1 : 0.45, transition: "all 0.35s" }}>
                                            {paused ? "Resume" : "Pause"}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ height: 2, background: C.creamDark, borderRadius: 2, overflow: "hidden" }}>
                                    <div key={`${animKey}-${paused}`} style={{ height: "100%", background: "linear-gradient(90deg, #FF006B, #3887FD)", borderRadius: 2, transformOrigin: "left", boxShadow: "0 0 6px rgba(255, 0, 107,0.5)", animation: paused ? "none" : "qg-prog 5s linear forwards" }} />
                                </div>
                            </div>

                            <button data-hover onClick={(e) => { e.stopPropagation(); goToContactForm(); }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#5A9DFE"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(56, 135, 253,0.4)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = C.purpleMid; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 20px rgba(56, 135, 253,0.3)"; }}
                                style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem", background: C.purpleMid, color: "#fff", border: "none", padding: "0.85rem 2rem", borderRadius: 50, cursor: "none", transition: "all 0.25s", whiteSpace: "nowrap", boxShadow: "0 6px 20px rgba(56, 135, 253,0.3)", display: "inline-flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                                Start This Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="svc-dots-row">
                {SERVICES.map((_, i) => (
                    <button key={i} data-hover onClick={() => handleSelect(i)}
                        style={{ width: active === i ? 28 : 8, height: 8, borderRadius: 50, border: "none", cursor: "none", background: active === i ? C.coral : C.creamDark, boxShadow: active === i ? "0 0 8px rgba(255, 0, 107,0.5)" : "none", transition: "all 0.3s ease" }} />
                ))}
            </div>
        </section>
    );
}

const STEP_BADGES = {
    "01": ["🎯 Goal-Driven", "📋 Documented", "🤝 Collaborative"],
    "02": ["✏️ Figma-First", "🖼️ Hi-Fi Ready", "🔄 Revision-Friendly"],
    "03": ["🔗 Live Previews", "🧱 Clean Code", "⚙️ Sprint-Based"],
    "04": ["🌐 Cross-Browser", "♿ Accessible", "⚡ Lighthouse 90+"],
    "05": ["📦 Full Source", "📄 Documented", "🚀 Production-Ready"],
};

/* ════ SERVICES PIPELINE ════ */
const SVC_STEPS = [
    { num: "01", phase: "Discovery", icon: "🔍", title: "Strategy Call", desc: "We map your goals, audience, and full project scope in a focused session. Everything aligned before any work begins.", details: ["Goals & scope defined", "Tech stack agreed", "Full brief documented"] },
    { num: "02", phase: "Design", icon: "🎨", title: "Design Sprint", desc: "Figma wireframes and full visual designs delivered and approved by you before a single line of code is written.", details: ["Wireframes first", "Hi-fi Figma mockups", "Design system ready"] },
    { num: "03", phase: "Build", icon: "⚙️", title: "Build & Iterate", desc: "Focused sprints with live staging links shared at every milestone. Real progress, real communication.", details: ["Live preview links", "Sprint check-ins", "Clean architecture"] },
    { num: "04", phase: "QA", icon: "✅", title: "Test & Polish", desc: "Cross-device testing, performance audits, accessibility checks. We do not ship until it is genuinely excellent.", details: ["Cross-browser tested", "Lighthouse audits", "Accessibility checks"] },
    { num: "05", phase: "Launch", icon: "🚀", title: "Deploy & Handoff", desc: "Full deployment handled end-to-end. Full source code, documentation, and a clean handoff to your team.", details: ["Deployment handled", "Full source code", "Docs & training"] },
];

function SvcStepCard({ step, index, isActive, isCurrent, isLeft, isMobile, isTablet }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    const [hov, setHov] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.05 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    const slideDir = isMobile ? 0 : (isLeft ? -36 : 36);
    return (
        <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : `translateX(${slideDir}px)`, transition: `opacity 0.55s ease ${index * 0.05}s, transform 0.55s ease ${index * 0.05}s` }}>
            <div style={{
                background: "#fff", borderRadius: isMobile ? 14 : 20,
                border: `1.5px solid ${isActive ? C.coral : C.creamDark}`,
                padding: isMobile ? "1rem" : isTablet ? "1.5rem 1.8rem" : "2rem 2.4rem",
                position: "relative", overflow: "hidden",
                boxShadow: isCurrent ? "0 10px 40px rgba(255, 0, 107,0.13), 0 2px 12px rgba(47, 52, 144,0.06)" : hov ? "0 8px 28px rgba(47, 52, 144,0.09)" : "0 2px 10px rgba(47, 52, 144,0.04)",
                transition: "all 0.4s ease",
                display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.3fr",
                gap: isMobile ? "0.85rem" : "2rem", alignItems: "center",
            }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: isActive ? 4 : 0, background: `linear-gradient(180deg, ${C.coral}, ${C.purple})`, borderRadius: "0 2px 2px 0", transition: "width 0.4s ease" }} />
                {isCurrent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.coral}, transparent)`, animation: "glowPulse 2s ease infinite" }} />}
                <div style={{ position: "absolute", top: "-0.3rem", right: "0.6rem", fontFamily: "'Bebas Neue',sans-serif", fontSize: isMobile ? "3.5rem" : "6rem", color: isActive ? C.purple : C.creamDark, opacity: isActive ? 0.055 : 0.45, lineHeight: 1, userSelect: "none", pointerEvents: "none", transition: "opacity 0.4s, color 0.4s" }}>{step.num}</div>

                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.65rem" }}>
                        <div style={{ width: isMobile ? 34 : 46, height: isMobile ? 34 : 46, borderRadius: 10, flexShrink: 0, background: isActive ? "rgba(255, 0, 107,0.07)" : C.creamDark, border: `1.5px solid ${isActive ? "rgba(255, 0, 107,0.15)" : C.creamDark}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? "1rem" : "1.35rem", animation: isCurrent ? "iconFloat 3s ease infinite" : "none", transition: "all 0.4s" }}>{step.icon}</div>
                        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: isMobile ? "0.55rem" : "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: isActive ? "rgba(255, 0, 107,0.07)" : C.creamDark, color: isActive ? C.coral : C.inkSoft, padding: "0.18rem 0.6rem", borderRadius: 50, border: `1px solid ${isActive ? "rgba(255, 0, 107,0.15)" : C.creamDark}`, transition: "all 0.4s" }}>{step.phase}</span>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: isMobile ? "1.15rem" : isTablet ? "1.7rem" : "clamp(1.6rem,2.6vw,2.3rem)", color: isActive ? C.ink : C.inkSoft, lineHeight: 1.05, marginBottom: "0.5rem", opacity: isActive ? 1 : 0.38, transition: "all 0.4s" }}>
                        <span style={{ color: C.coral, marginRight: "0.25rem" }}>{step.num}</span>{step.title}
                    </div>
                    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? "0.75rem" : "0.87rem", color: isActive ? C.inkSoft : "rgba(0,0,0,0.28)", lineHeight: 1.7, margin: 0, transition: "color 0.4s" }}>{step.desc}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {step.details.map((d, di) => (
                        <div key={d} style={{ background: isActive ? "rgba(255, 0, 107,0.04)" : C.creamDark, border: `1px solid ${isActive ? "rgba(255, 0, 107,0.1)" : C.creamDark}`, borderLeft: `3px solid ${isActive ? C.coral : C.creamDark}`, borderRadius: "0 10px 10px 0", padding: isMobile ? "0.38rem 0.6rem" : "0.58rem 0.85rem", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: isMobile ? "0.68rem" : "0.77rem", color: isActive ? C.ink : C.inkSoft, display: "flex", alignItems: "center", gap: "0.45rem", opacity: isActive ? 1 : 0.38, transform: isActive ? "translateX(0)" : "translateX(-8px)", transition: `all 0.4s ease ${di * 0.07}s` }}>
                            <span style={{ color: C.coral, fontWeight: 800, opacity: isActive ? 1 : 0.25, transition: "opacity 0.4s", flexShrink: 0 }}>✓</span>{d}
                        </div>
                    ))}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.32rem", marginTop: "0.4rem" }}>
                        {(STEP_BADGES[step.num] || ["⚡ Fast", "🔒 Transparent", "📈 Scalable"]).map((label, bi) => (
                            <div key={label} style={{
                                background: isActive
                                    ? "linear-gradient(135deg, rgba(255, 0, 107,0.06), rgba(47, 52, 144,0.06))"
                                    : C.creamDark,
                                border: `1px solid ${isActive ? "rgba(255, 0, 107,0.18)" : C.creamDark}`,
                                borderTop: isActive ? `2px solid ${C.coral}` : "2px solid transparent",
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

function SvcConnector({ fromLeft, toLeft, fillPct, containerWidth, isMobileWidth, isTabletWidth }) {
    const cardPct = isMobileWidth ? 1.0 : isTabletWidth ? 0.80 : 0.63;
    const leftCX = containerWidth * (cardPct / 2);
    const rightCX = containerWidth * (1 - cardPct / 2);
    const startX = fromLeft ? leftCX : rightCX;
    const endX = toLeft ? leftCX : rightCX;
    const H = isMobileWidth ? 80 : 110;
    if (isMobileWidth) {
        const trackW = 4;
        return (
            <div style={{ width: "100%", height: H, position: "relative", pointerEvents: "none" }}>
                <div style={{ position: "absolute", left: startX - trackW / 2, top: 0, width: trackW, height: H, background: "#E8E0D5", borderRadius: 4 }} />
                <div style={{ position: "absolute", left: startX - trackW / 2, top: 0, width: trackW, height: `${fillPct}%`, background: "linear-gradient(180deg, #FF006B, #5A9DFE)", borderRadius: 4, boxShadow: fillPct > 0 ? "0 0 8px rgba(255, 0, 107,0.5)" : "none", transition: "height 0.5s ease-out" }} />
            </div>
        );
    }
    const pathD = `M ${startX} 0 C ${startX} ${H * 0.6}, ${endX} ${H * 0.4}, ${endX} ${H}`;
    const dx = Math.abs(endX - startX);
    const approxLen = Math.sqrt(dx * dx + H * H) * 1.2 + 40;
    const gradId = `svgrad-${fromLeft ? 0 : 1}-${toLeft ? 0 : 1}`;
    return (
        <div style={{ width: "100%", height: H, pointerEvents: "none" }}>
            <svg width={containerWidth} height={H} style={{ display: "block", overflow: "visible" }}>
                <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF006B" />
                        <stop offset="100%" stopColor="#5A9DFE" />
                    </linearGradient>
                </defs>
                <path d={pathD} fill="none" stroke="#E8E0D5" strokeWidth="6" strokeLinecap="round" />
                <path d={pathD} fill="none" stroke={`url(#${gradId})`} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={approxLen}
                    strokeDashoffset={approxLen - (fillPct / 100) * approxLen}
                    style={{ filter: "drop-shadow(0 0 5px rgba(255, 0, 107,0.5))", transition: "stroke-dashoffset 0.5s ease-out" }}
                />
            </svg>
        </div>
    );
}

function SvcPipeline({ setPage, goToProcessPipeline }) {
    const wrapRef = useRef(null);
    const cardRefs = useRef([]);
    const [activeStep, setActiveStep] = useState(null);
    const [connFills, setConnFills] = useState(Array(SVC_STEPS.length - 1).fill(0));
    const [containerW, setContainerW] = useState(960);
    const [screenW, setScreenW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

    useEffect(() => {
        const measure = () => {
            if (wrapRef.current) setContainerW(wrapRef.current.offsetWidth);
            setScreenW(window.innerWidth);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

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
            const fills = SVC_STEPS.slice(0, -1).map((_, i) => {
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
        <section style={{ background: C.cream, padding: isMobile ? "2rem 3.5% 3rem" : "4rem 5% 5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
                <div>
                    <Reveal><STag>How We Work</STag></Reveal>
                    <Reveal delay={0.08}>
                        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.8rem,4.8vw,3.4rem)", lineHeight: 1.03, color: C.ink }}>
                            Simple. Transparent. <span style={{ color: C.coral }}>Effective.</span>
                        </h2>
                    </Reveal>
                </div>
                <Reveal delay={0.14}>
                    <button onClick={goToProcessPipeline}
                        onMouseEnter={e => { e.currentTarget.style.background = C.purple; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = C.purple; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.purple; e.currentTarget.style.borderColor = "rgba(47, 52, 144,0.18)"; }}
                        style={{ background: "none", border: "1.5px solid rgba(47, 52, 144,0.18)", color: C.purple, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem", padding: "0.6rem 1.5rem", borderRadius: 50, cursor: "pointer", transition: "all 0.2s" }}>
                        Full Process →
                    </button>
                </Reveal>
            </div>

            <div ref={wrapRef} style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 960, margin: "0 auto" }}>
                {SVC_STEPS.map((step, i) => {
                    const isLeft = isMobile ? true : i % 2 === 0;
                    const isActive = activeStep !== null && i <= activeStep;
                    const isCurrent = activeStep === i;
                    return (
                        <div key={step.num}>
                            <div style={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-end" }}>
                                <div ref={el => cardRefs.current[i] = el} style={{ width: cardWidth }}>
                                    <SvcStepCard step={step} index={i} isActive={isActive} isCurrent={isCurrent} isLeft={isLeft} isMobile={isMobile} isTablet={isTablet} />
                                </div>
                            </div>
                            {i < SVC_STEPS.length - 1 && (
                                <SvcConnector fromLeft={isLeft} toLeft={isMobile ? true : !isLeft} fillPct={connFills[i] ?? 0} containerWidth={containerW} isMobileWidth={isMobile} isTabletWidth={isTablet} />
                            )}
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes glowPulse { 0%,100%{opacity:0.55} 50%{opacity:1} }
                @keyframes iconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
            `}</style>
        </section>
    );
}

/* ════ PAGE EXPORT ════ */


export default function ServicesPage({ setPage, targetService, onServiceHandled, goToContactForm, goToProcessPipeline }) {

    useLayoutEffect(() => {
        if (targetService) {
            const el = document.getElementById("svc-explorer-grid");
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "instant" });
            }
        }
    }, [targetService]);


    const [screenW, setScreenW] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1200
    );
    useEffect(() => {
        const h = () => setScreenW(window.innerWidth);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);
    const sm = screenW < 768;
    const md = screenW >= 768 && screenW < 1024;

    const MQ1 = ["Web Development", "UI/UX Design", "App Development", "E-Commerce", "WordPress & CMS", "Graphic Design", "Fast Delivery", "Pixel Perfect", "Clean Code", "Mobile First"];
    const MQ2 = ["Web Dev", "UI/UX", "App Dev", "E-Commerce", "WordPress", "Graphic Design", "Clean Code", "Fast Launch", "Pixel Perfect"];

    return (
        <div style={{ width: "100%", minWidth: 0, paddingTop: 70 }}>

            {/* ══ HERO ══ */}
            <section style={{
                background: C.purpleDark, padding: "5rem 5%", position: "relative", overflow: "hidden", minHeight: 400,
                backgroundImage: "radial-gradient(circle at 80% 30%, rgba(255, 0, 107,0.10), transparent 55%), radial-gradient(circle at 10% 90%, rgba(90, 157, 254,0.18), transparent 50%)",
            }}>
                <div className="svc-ghost-services" style={{
                    fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(5rem,18vw,15rem)", color: "rgba(80,40,140,0.45)",
                    lineHeight: 1, letterSpacing: "0.01em", userSelect: "none", pointerEvents: "none", position: "absolute",
                    top: "50%", right: "-3rem", transform: "translateY(-50%)", whiteSpace: "nowrap", zIndex: 1,
                }}>SERVICES</div>

                <div style={{ position: "relative", zIndex: 2, maxWidth: 680 }}>
                    <Reveal><STag light>What We Offer</STag></Reveal>
                    <Reveal delay={0.06}>
                        <h1 className="svc-hero-h1" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(3.5rem,8vw,7rem)", color: C.cream, lineHeight: 0.92, marginBottom: "1.4rem" }}>
                            EVERY SERVICE<br />YOUR BRAND<br /><span style={{ color: C.coral }}>NEEDS ONLINE.</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.12}>
                        <p style={{ color: "rgba(247,243,236,0.5)", fontSize: "1rem", lineHeight: 1.75, maxWidth: 480 }}>
                            From pixel-perfect interfaces to scalable backends — we cover every layer of your digital product, in-house, with care and precision.
                        </p>
                    </Reveal>
                    <Reveal delay={0.18}>
                        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "2rem" }}>
                            {["React", "Next.js", "Flutter", "WordPress", "Shopify", "Figma", "Node.js", "Django"].map(t => (
                                <span key={t} style={{
                                    background: "rgba(56,135,253,0.12)", border: "1px solid rgba(56,135,253,0.35)",
                                    fontFamily: "'Syne',sans-serif", fontSize: "0.72rem", fontWeight: 700,
                                    padding: "0.3rem 0.9rem", borderRadius: 50, color: "#FF006B", letterSpacing: "0.06em",
                                }}>{t}</span>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            <Marquee items={MQ1} blue />

            {/* ══ SERVICE EXPLORER ══ */}
            <ServiceExplorer
                setPage={setPage}
                targetService={targetService}
                onServiceHandled={onServiceHandled}
                goToContactForm={goToContactForm}
                goToProcessPipeline={goToProcessPipeline}
            />

            <Marquee items={MQ2} blue reverse/>

            {/* ══ PROCESS PIPELINE ══ */}
            <SvcPipeline setPage={setPage} goToProcessPipeline={goToProcessPipeline} />

            {/* ══ CTA BANNER — exactly matching About & Process pages ══ */}
            <section style={{ background: C.creamDark, padding: sm ? "2.5rem 5%" : "4rem 6%" }}>
                <Reveal>
                    <div style={{
                        background: `linear-gradient(135deg, ${C.purpleDark} 0%, #3d1b6e 55%, #5930A8 100%)`,
                        borderRadius: sm ? 16 : 20,
                        padding: sm
                            ? "2rem 1.6rem"
                            : md
                                ? "3rem 3rem"   // 🔥 key fix
                                : "3.5rem 4rem",
                        display: "flex",
                        flexDirection: sm ? "column" : md ? "column" : "row",
                        alignItems: sm ? "stretch" : md ? "flex-start" : "center",
                        justifyContent: "space-between",
                        gap: sm ? "1.5rem" : md ? "1.8rem" : "2rem",
                        position: "relative",
                        overflow: "hidden",
                        borderTop: `3px solid ${C.coral}`,
                    }}>
                        {/* Radial glow blob — matches About & Process */}
                        <div style={{
                            position: "absolute", top: "-2rem", right: "8rem",
                            width: 260, height: 260, borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(255, 0, 107,0.18), transparent 65%)",
                            pointerEvents: "none",
                        }} />

                        {/* Text block */}
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <h2 style={{
                                fontFamily: "'Bebas Neue',sans-serif",
                                fontSize: sm ? "clamp(2rem,7vw,2.8rem)" : "clamp(2.2rem,4.5vw,3.6rem)",
                                color: "#fff",
                                lineHeight: sm ? 1.05 : 0.95,
                                marginBottom: "0.8rem",
                            }}>
                                NOT SURE WHICH<br />SERVICE YOU <span style={{ color: C.coral }}>NEED?</span>
                            </h2>
                            <p style={{
                                color: "rgba(247,243,236,0.5)",
                                fontSize: "0.95rem",
                                lineHeight: 1.7,
                                maxWidth: 420,
                                margin: 0,
                            }}>
                                Tell us your goal — we'll figure out the perfect approach together. Free call, no commitment.
                            </p>
                        </div>

                        {/* CTA button — full-width on mobile, auto on larger screens */}
                        <button
                            onClick={goToContactForm}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "#5A9DFE";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 16px 40px rgba(56, 135, 253,0.5)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = C.purpleMid;
                                e.currentTarget.style.transform = "";
                                e.currentTarget.style.boxShadow = "0 6px 24px rgba(56, 135, 253,0.35)";
                            }}
                            style={{
                                fontFamily: "'Syne',sans-serif",
                                fontWeight: 700,
                                fontSize: "1rem",
                                background: C.purpleMid,
                                color: "#fff",
                                border: "none",
                                padding: sm ? "1rem" : md ? "0.9rem 2rem" : "1rem 2.4rem",
                                borderRadius: 50,
                                cursor: "pointer",
                                transition: "all 0.25s",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                boxShadow: "0 6px 24px rgba(56, 135, 253,0.35)",
                                position: "relative",
                                zIndex: 1,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                                width: sm ? "100%" : "auto",
                                justifyContent: sm ? "center" : "flex-start",
                            }}>
                            Book a Free Call
                        </button>
                    </div>
                </Reveal>
            </section>

            <style>{`
                @keyframes marquee    { from{transform:translateX(0)}        to{transform:translateX(-33.333%)} }
                @keyframes marqueeRev { from{transform:translateX(-33.333%)} to{transform:translateX(0)} }
                @keyframes svcScanLine { 0%{top:-1px;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{top:101%;opacity:0} }
                @keyframes svcIconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                @keyframes qg-prog { from{transform:scaleX(0)} to{transform:scaleX(1)} }
                @keyframes hintPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(0.96)} }
            `}</style>
        </div>
    );
}