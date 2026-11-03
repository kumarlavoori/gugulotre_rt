import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { C } from "../components/theme";

/* ════════════════════════════════════════════════════════════════════════════
   OUR WORK — the gallery builds itself from the folders in  src/assets/gallery/

       src/assets/gallery/<service>/<type of work>/<image file>
       e.g.  graphic-design/visiting-cards/Sri-Sai-Traders.jpg

   • Add an image  → drop it in the right folder.
   • Remove one    → delete the file.
   • New type      → create a new folder (its name becomes the heading).
   Then run  npm run build  on the server. Order: start a folder or file name with a number (01-, 02- ...) to put it first.
   ════════════════════════════════════════════════════════════════════════════ */

const FILES = import.meta.glob("../assets/gallery/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}", { eager: true, query: "?url", import: "default" });

/* Order of the service tabs (same order as the Services page). Folders not listed here go after these, A–Z. */
const SERVICE_ORDER = ["web-development", "graphic-design", "video-editing", "e-commerce", "ui-ux-design", "wordpress-cms", "app-development"];

/* Headings that can't be made from the folder name alone. Anything else: "visiting-cards" → "Visiting Cards". */
const LABELS = {
    "e-commerce": "E-Commerce",
    "ui-ux-design": "UI / UX Design",
    "wordpress-cms": "WordPress & CMS",
};
const ACRONYMS = new Set(["id", "ui", "ux", "cms", "seo", "qr", "pvc", "pdf", "gst", "3d", "ai"]);

/* Shape of the frame each type of work is shown in, as "width / height".
   Images are never cropped; they are fitted inside the frame. Types not listed use 4 / 3. */
const SHAPES = {
    "visiting-cards": "7 / 4",
    "id-cards": "3 / 4",
    "package-design": "1 / 1",
    "packaging": "1 / 1",
    "logos": "1 / 1",
    "posters": "3 / 4",
    "flyers": "3 / 4",
    "brochures": "3 / 2",
    "social-media-posts": "1 / 1",
    "banners": "16 / 9",
    "websites": "16 / 10",
    "web-apps": "16 / 10",
    "online-stores": "16 / 10",
    "app-screens": "3 / 4",
    "mobile-apps": "3 / 4",
    "thumbnails": "16 / 9",
};
const DEFAULT_SHAPE = "4 / 3";

/* Each type of work first shows this many rows; the rest opens with "View more". */
const ROWS_SHOWN = 2;

/* ── Build the gallery from the file list (runs once) ── */
const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
/* "01-visiting-cards" → 1. Folders that start with a number are shown first, in number order. */
const rankOf = (folder) => { const m = folder.match(/^(\d+)[-_. ]/); return m ? Number(m[1]) : null; };
const byRank = (a, b) => { const ra = rankOf(a), rb = rankOf(b); return ra === null && rb === null ? 0 : ra === null ? 1 : rb === null ? -1 : ra - rb; };
const slugOf = (folder) => folder.replace(/^\d+[-_. ]+/, "").trim().toLowerCase().replace(/[\s_]+/g, "-");
const labelOf = (slug) =>
    LABELS[slug] ||
    slug.split("-").filter(Boolean).map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))).join(" ");

/* "03-Sri Sai Traders.jpg" → "Sri Sai Traders". Camera / phone names (IMG_2031) give no caption. */
function captionOf(file) {
    const name = file.replace(/\.[^.]+$/, "").replace(/^\d+[-_. ]+/, "").replace(/[-_]+/g, " ").replace(/\s{2,}/g, " ").trim();
    if (!name || /^(img|dsc|image|photo|pxl|screenshot|whatsapp|untitled|\d+$)/i.test(name)) return "";
    return name;
}

function buildGallery() {
    const cats = new Map();
    for (const [path, url] of Object.entries(FILES)) {
        const parts = path.split("/assets/gallery/")[1]?.split("/") ?? [];
        if (parts.length < 2) continue; // an image sitting directly in gallery/ has no service folder
        const catFolder = parts[0];
        const groupFolder = parts.length > 2 ? parts[1] : "";
        const file = parts[parts.length - 1];
        const catSlug = slugOf(catFolder);
        if (!cats.has(catSlug)) cats.set(catSlug, { slug: catSlug, label: labelOf(catSlug), folder: catFolder, groups: new Map() });
        const cat = cats.get(catSlug);
        const groupSlug = groupFolder ? slugOf(groupFolder) : "selected-work";
        if (!cat.groups.has(groupSlug)) cat.groups.set(groupSlug, { slug: groupSlug, label: labelOf(groupSlug), folder: groupFolder, files: [] });
        cat.groups.get(groupSlug).files.push({ file, url });
    }
    return [...cats.values()]
        .sort((a, b) => {
            const r = byRank(a.folder, b.folder);
            if (r) return r;
            const ia = SERVICE_ORDER.indexOf(a.slug), ib = SERVICE_ORDER.indexOf(b.slug);
            if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
            return naturalSort(a.folder, b.folder);
        })
        .map((cat) => {
            const groups = [...cat.groups.values()]
                .sort((a, b) => byRank(a.folder, b.folder) || naturalSort(a.folder, b.folder))
                .map((g) => ({
                    slug: g.slug,
                    label: g.label,
                    items: g.files
                        .sort((a, b) => naturalSort(a.file, b.file))
                        .map((f, i) => {
                            const caption = captionOf(f.file);
                            return { url: f.url, caption, alt: caption || `${g.label} design ${i + 1}` };
                        }),
                }));
            return { slug: cat.slug, label: cat.label, groups, count: groups.reduce((n, g) => n + g.items.length, 0) };
        });
}
const GALLERY = buildGallery();
const TOTAL = GALLERY.reduce((n, c) => n + c.count, 0);

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

/* ════ ONE PIECE OF WORK (a framed print on the dark wall) ════ */
function Tile({ item, shape, onOpen }) {
    const [broken, setBroken] = useState(false);
    if (broken) return null;
    return (
        <button type="button" className="work-tile" onClick={onOpen} aria-label={`View larger: ${item.alt}`} style={{ aspectRatio: shape }}>
            <img src={item.url} alt="" loading="lazy" decoding="async" onError={() => setBroken(true)} />
        </button>
    );
}

/* ════ ONE TYPE OF WORK (e.g. Visiting Cards) ════ */
function Group({ group, single, sm, onOpen }) {
    const shape = SHAPES[group.slug] || DEFAULT_SHAPE;
    const [w, h] = shape.split("/").map((n) => parseFloat(n));
    const min = sm ? 145 : w < h ? 180 : w === h ? 220 : 270; // portrait frames are narrower, so more fit per row
    const gridRef = useRef(null);
    const topRef = useRef(null);
    const [cols, setCols] = useState(0); // how many pieces fit in one row right now (0 = not measured yet)
    const [open, setOpen] = useState(false);

    /* count the columns the grid really has, so "2 rows" stays 2 rows on any screen */
    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;
        const measure = () => setCols(getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length);
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const limit = (cols || 4) * ROWS_SHOWN;
    const total = group.items.length;
    const hidden = Math.max(0, total - limit);
    const shownItems = open ? group.items : group.items.slice(0, limit);

    const toggle = () => {
        if (open) topRef.current?.scrollIntoView({ block: "nearest", behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        setOpen((v) => !v);
    };

    return (
        <div ref={topRef} style={{ marginBottom: sm ? "2.2rem" : "3rem", scrollMarginTop: 140 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: sm ? "0.9rem" : "1.2rem" }}>
                {single ? (
                    <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: sm ? "1.7rem" : "2.3rem", lineHeight: 1, color: C.cream, margin: 0 }}>{group.label}</h2>
                ) : (
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: sm ? "1.05rem" : "1.2rem", lineHeight: 1.2, color: C.cream, margin: 0 }}>{group.label}</h3>
                )}
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.7rem", color: C.coralSoft, background: "rgba(255,0,107,0.14)", borderRadius: 50, padding: "0.2rem 0.6rem" }}>{total}</span>
                <span aria-hidden="true" style={{ flex: 1, height: 1, background: "rgba(247,243,236,0.12)" }} />
            </div>
            <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: sm ? "0.7rem" : "1.1rem" }}>
                {shownItems.map((item, i) => (
                    <Tile key={item.url} item={item} shape={shape} onOpen={() => onOpen(group, i)} />
                ))}
            </div>
            {(hidden > 0 || open) && total > limit && (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: sm ? "1.1rem" : "1.5rem" }}>
                    <span aria-hidden="true" style={{ flex: 1, height: 1, background: "rgba(247,243,236,0.12)" }} />
                    <button type="button" className="work-more" onClick={toggle} aria-expanded={open}>
                        {open ? "Show less" : <>View {hidden} more</>}
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    <span aria-hidden="true" style={{ flex: 1, height: 1, background: "rgba(247,243,236,0.12)" }} />
                </div>
            )}
        </div>
    );
}

/* ════ FULL-SIZE VIEWER ════ */
function Viewer({ group, index, onClose, onStep }) {
    const closeRef = useRef(null);
    const touchX = useRef(null);
    const item = group.items[index];
    const many = group.items.length > 1;

    /* keyboard, page scroll lock, and returning focus to the piece that was opened */
    useEffect(() => {
        const opener = document.activeElement;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = prevOverflow;
            if (opener instanceof HTMLElement) opener.focus();
        };
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowRight") onStep(1);
            else if (e.key === "ArrowLeft") onStep(-1);
            else if (e.key === "Tab") {
                const nodes = [...document.querySelectorAll(".work-viewer button")];
                if (!nodes.length) return;
                const first = nodes[0], last = nodes[nodes.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose, onStep]);

    /* load the neighbours early so stepping feels instant */
    useEffect(() => {
        for (const d of [-1, 1]) {
            const n = group.items[(index + d + group.items.length) % group.items.length];
            if (n) new Image().src = n.url;
        }
    }, [group, index]);

    return (
        <div
            className="work-viewer" role="dialog" aria-modal="true" aria-label={`${group.label}, ${index + 1} of ${group.items.length}`}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
                if (touchX.current === null || !many) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                touchX.current = null;
                if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
            }}
        >
            <div className="work-viewer-top">
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "rgba(247,243,236,0.75)" }}>
                    {group.label}{many ? <span style={{ marginLeft: "0.7rem", color: "rgba(247,243,236,0.5)" }}>{index + 1} of {group.items.length}</span> : null}
                </div>
                <button ref={closeRef} type="button" className="work-vbtn" onClick={onClose} aria-label="Close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
                </button>
            </div>

            <div className="work-viewer-stage">
                {many && (
                    <button type="button" className="work-vbtn work-vprev" onClick={() => onStep(-1)} aria-label="Previous">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 5 8 12 15 19" /></svg>
                    </button>
                )}
                <img key={item.url} src={item.url} alt={item.alt} className="work-viewer-img" />
                {many && (
                    <button type="button" className="work-vbtn work-vnext" onClick={() => onStep(1)} aria-label="Next">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 5 16 12 9 19" /></svg>
                    </button>
                )}
            </div>

            <p className="work-viewer-cap">{item.caption}</p>
        </div>
    );
}

/* ════ PAGE ════ */
export default function GalleryPage({ goToContactForm }) {
    const width = useWindowWidth();
    const sm = width < 640;
    const md = width < 1024;
    const [params, setParams] = useSearchParams();
    const [viewer, setViewer] = useState(null); // { group, index } | null

    const wanted = params.get("type");
    const active = GALLERY.some((c) => c.slug === wanted) ? wanted : "all";
    const shown = active === "all" ? GALLERY : GALLERY.filter((c) => c.slug === active);
    const single = active !== "all";
    const pick = (slug) => setParams(slug === "all" ? {} : { type: slug }, { replace: true });

    const heroPad = sm ? "1.8rem 4% 2.2rem" : md ? "2.6rem 4% 2.8rem" : "clamp(2.6rem,5vw,4rem) 5% clamp(2.8rem,5vw,4.2rem)";
    const bodyPad = sm ? "1.8rem 4% 1.2rem" : md ? "2.4rem 4% 1.8rem" : "3.2rem 5% 2.2rem";

    const stepViewer = (d) => setViewer((v) => (v ? { ...v, index: (v.index + d + v.group.items.length) % v.group.items.length } : v));
    const closeViewer = () => setViewer(null);

    return (
        <div className="work-page" style={{ width: "100%", minWidth: 0, paddingTop: 70, fontFamily: "'Outfit',sans-serif" }}>
            <style>{`
                /* html/body/#root are overflow-x:hidden globally, which stops position:sticky (the filter bar) from working.
                   While this page is open they use "clip" instead: same look, but not a scroll container. */
                @supports (overflow: clip) { html, body, #root { overflow-x: clip !important; } }
                .work-page { overflow-x: hidden; overflow-x: clip; }

                .work-hero-in { animation: fadeUp 0.6s ease both; }

                .work-tab { flex-shrink: 0; white-space: nowrap; font-family: 'Syne',sans-serif; font-weight: 600; font-size: 0.83rem; border: none; cursor: pointer;
                    padding: 0.45rem 0.95rem; border-radius: 50px; color: ${C.inkSoft}; background: transparent; display: inline-flex; align-items: center; gap: 0.45rem; transition: background 0.2s, color 0.2s; }
                .work-tab:hover { color: ${C.coral}; background: rgba(255,0,107,0.07); }
                .work-tab[aria-pressed="true"] { color: #fff; background: ${C.coral}; box-shadow: 0 3px 12px rgba(255,0,107,0.28); }
                .work-tab small { font-size: 0.68rem; font-weight: 700; opacity: 0.65; }
                .work-tabs { scrollbar-width: none; }
                .work-tabs::-webkit-scrollbar { display: none; }

                .work-tile { --pad: clamp(10px, 1.5vw, 18px); position: relative; display: block; width: 100%; padding: 0; overflow: hidden; cursor: pointer;
                    background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px;
                    transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease; }
                .work-tile img { position: absolute; inset: var(--pad); width: calc(100% - 2 * var(--pad)); height: calc(100% - 2 * var(--pad)); object-fit: contain;
                    filter: drop-shadow(0 10px 18px rgba(0,0,0,0.4)); }
                .work-tile:hover { transform: translateY(-4px); border-color: rgba(255,0,107,0.7); background: rgba(255,255,255,0.09); }

                .work-more { display: inline-flex; align-items: center; gap: 0.55rem; cursor: pointer; font-family: 'Syne',sans-serif; font-weight: 700; font-size: 0.82rem;
                    color: ${C.cream}; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(247,243,236,0.3); border-radius: 50px; padding: 0.7rem 1.5rem;
                    transition: background 0.2s, border-color 0.2s, transform 0.2s; }
                .work-more:hover { background: rgba(255,0,107,0.18); border-color: ${C.coral}; transform: translateY(-2px); }

                .work-tab:focus-visible, .work-tile:focus-visible, .work-btn:focus-visible, .work-vbtn:focus-visible, .work-more:focus-visible { outline: 3px solid rgba(255,0,107,0.55); outline-offset: 3px; }

                .work-viewer { position: fixed; inset: 0; z-index: 1000; display: flex; flex-direction: column; background: rgba(14,16,48,0.95); backdrop-filter: blur(8px); animation: workFade 0.18s ease both; }
                .work-viewer-top { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 4%; flex-shrink: 0; }
                .work-viewer-stage { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 0 4%; }
                .work-viewer-img { display: block; max-width: 100%; max-height: 100%; min-width: 0; object-fit: contain; border-radius: 4px; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
                .work-viewer-cap { flex-shrink: 0; min-height: 3rem; margin: 0; padding: 0.9rem 4% 1.2rem; text-align: center; font-size: 0.9rem; line-height: 1.5; color: rgba(247,243,236,0.8); }
                .work-vbtn { flex-shrink: 0; width: 46px; height: 46px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
                    color: ${C.cream}; background: rgba(255,255,255,0.07); border: 1.5px solid rgba(247,243,236,0.28); transition: background 0.2s, border-color 0.2s; }
                .work-vbtn:hover { background: rgba(255,0,107,0.3); border-color: ${C.coral}; }
                @media (max-width: 640px) {
                    .work-viewer-stage { position: relative; padding: 0 3%; }
                    .work-vprev, .work-vnext { position: absolute; bottom: 0.4rem; z-index: 2; background: rgba(14,16,48,0.7); }
                    .work-vprev { left: 4%; } .work-vnext { right: 4%; }
                    .work-viewer-cap { padding-bottom: 4.2rem; min-height: 5rem; }
                }
                @keyframes workFade { from { opacity: 0; } to { opacity: 1; } }
                @media (prefers-reduced-motion: reduce) {
                    .work-hero-in, .work-viewer { animation: none; }
                    .work-tile, .work-tab, .work-vbtn, .work-more { transition: none; }
                    .work-tile:hover, .work-more:hover { transform: none; }
                }
            `}</style>

            {/* ══ HERO ══ */}
            <section style={{
                background: C.purpleDark, padding: heroPad, position: "relative", overflow: "hidden",
                backgroundImage: "radial-gradient(circle at 75% 25%, rgba(255, 0, 107,0.14), transparent 50%), radial-gradient(circle at 5% 85%, rgba(90, 157, 254,0.22), transparent 50%)",
            }}>
                {!md && (
                    <div aria-hidden="true" style={{
                        fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(3.4rem,10vw,8.5rem)", color: "rgba(90,157,254,0.1)", lineHeight: 1,
                        userSelect: "none", pointerEvents: "none", position: "absolute", top: "50%", right: "-1rem", transform: "translateY(-50%)", whiteSpace: "nowrap",
                    }}>GALLERY</div>
                )}
                <div style={{ position: "relative", zIndex: 2, maxWidth: 700 }}>
                    <h1 className="work-hero-in" style={{
                        fontFamily: "'Bebas Neue',sans-serif", margin: 0, color: C.cream, fontWeight: 400,
                        fontSize: sm ? "clamp(1.9rem,8.5vw,2.7rem)" : md ? "clamp(2.6rem,6vw,4rem)" : "clamp(3rem,5.5vw,5rem)", lineHeight: sm ? 1.08 : 0.95,
                    }}>
                        SEE WHAT WE MAKE<br /><span style={{ color: C.coral }}>BEFORE YOU START.</span>
                    </h1>
                    <p className="work-hero-in" style={{ animationDelay: "0.1s", color: "rgba(247,243,236,0.7)", fontSize: sm ? "0.8rem" : "clamp(0.82rem,1.4vw,0.96rem)", lineHeight: 1.75, maxWidth: 520, margin: sm ? "0.9rem 0 0" : "1.1rem 0 0" }}>
                        Choose a service to browse what we have made for our clients.
                    </p>
                </div>
            </section>

            {/* ══ FILTER BAR ══ */}
            {TOTAL > 0 && (
                <div style={{ position: "sticky", top: 70, zIndex: 200, background: "rgba(247,243,236,0.96)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.creamDark}`, padding: sm || md ? "0 4%" : "0 5%" }}>
                    <div style={{ maxWidth: 1360, margin: "0 auto" }}>
                        <div className="work-tabs" role="group" aria-label="Filter work by service" style={{ display: "flex", gap: "0.4rem", overflowX: "auto", padding: "0.75rem 0" }}>
                            <button type="button" className="work-tab" aria-pressed={active === "all"} onClick={() => pick("all")}>All<small>{TOTAL}</small></button>
                            {GALLERY.map((c) => (
                                <button key={c.slug} type="button" className="work-tab" aria-pressed={active === c.slug} onClick={() => pick(c.slug)}>{c.label}<small>{c.count}</small></button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ══ GALLERY ══ */}
            <section style={{
                background: C.purpleDark, padding: bodyPad, minHeight: sm ? 260 : 360,
                backgroundImage: "radial-gradient(circle at 90% 8%, rgba(255, 0, 107,0.08), transparent 45%), radial-gradient(circle at 4% 70%, rgba(90, 157, 254,0.12), transparent 50%)",
            }}>
                <div style={{ maxWidth: 1360, margin: "0 auto" }}>
                    {TOTAL === 0 ? (
                        <div style={{ textAlign: "center", padding: sm ? "2rem 0" : "3rem 0" }}>
                            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: sm ? "1.8rem" : "2.6rem", color: C.cream, margin: "0 0 0.6rem" }}>OUR GALLERY IS COMING SOON.</h2>
                            <p style={{ color: "rgba(247,243,236,0.7)", fontSize: "0.92rem", lineHeight: 1.75, maxWidth: 440, margin: "0 auto" }}>
                                We are adding our projects here. Tell us what you need and we will show you similar work.
                            </p>
                        </div>
                    ) : (
                        shown.map((cat) => (
                            <div key={cat.slug} style={{ marginBottom: sm ? "2.2rem" : "3.4rem" }}>
                                {!single && (
                                    <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: sm ? "2rem" : "3rem", lineHeight: 1, color: C.cream, margin: `0 0 ${sm ? "1.2rem" : "1.6rem"}`, display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                        <span aria-hidden="true" style={{ width: 4, height: sm ? 24 : 34, background: C.coral, borderRadius: 2, flexShrink: 0 }} />
                                        {cat.label}
                                    </h2>
                                )}
                                {cat.groups.map((g) => (
                                    <Group key={g.slug} group={g} single={single} sm={sm} onOpen={(group, index) => setViewer({ group, index })} />
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* ══ CLOSING CALL ══ */}
            <section style={{ background: C.cream, padding: sm ? "2.4rem 4%" : "clamp(3rem,5vw,4.2rem) 5%" }}>
                <div style={{ maxWidth: 1360, margin: "0 auto", display: "flex", flexDirection: md ? "column" : "row", alignItems: md ? "flex-start" : "center", justifyContent: "space-between", gap: "1.4rem" }}>
                    <div>
                        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: sm ? "clamp(1.6rem,6.5vw,2rem)" : "clamp(1.9rem,3.5vw,2.8rem)", color: C.ink, lineHeight: 0.95, margin: "0 0 0.7rem" }}>
                            NEED SOMETHING LIKE THIS?<br /><span style={{ color: C.coral }}>TELL US WHAT YOU NEED.</span>
                        </h2>
                        <p style={{ fontSize: sm ? "0.83rem" : "0.92rem", lineHeight: 1.7, color: C.inkSoft, margin: 0, maxWidth: 480 }}>
                            Send us a few details about your project and we will get back to you.
                        </p>
                    </div>
                    <button type="button" className="work-btn" onClick={goToContactForm} style={{
                        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: sm ? "0.8rem" : "0.88rem", background: C.coral, color: "#fff", border: "none",
                        padding: "0.8rem 1.9rem", borderRadius: 50, cursor: "pointer", boxShadow: "0 6px 22px rgba(255, 0, 107,0.35)", width: sm ? "100%" : "auto", flexShrink: 0,
                    }}>Start a project</button>
                </div>
            </section>

            {viewer && <Viewer group={viewer.group} index={viewer.index} onClose={closeViewer} onStep={stepViewer} />}
        </div>
    );
}