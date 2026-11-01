// scripts/seo-build.mjs
// Runs after "vite build" (see package.json). Search engines and WhatsApp/Facebook/LinkedIn link previews
// read the HTML file of a page *before* any JavaScript runs. This script makes sure each page has its own
// title, description, address and share tags in that HTML, and it writes sitemap.xml.
//
// Output (all inside dist/):  about.html, services.html, gallery.html, ...  and  sitemap.xml
// Needs one nginx line so /about serves about.html: see DEPLOY_VPS.md ("SEO").
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const { PAGES, SITE, urlFor } = await import(pathToFileURL(resolve(root, "src/seo.js")).href);

if (!existsSync(resolve(dist, "index.html"))) {
    console.error("[seo] dist/index.html not found. Run `vite build` first.");
    process.exit(1);
}
const template = readFileSync(resolve(dist, "index.html"), "utf8");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Replace one tag (found by a pattern) with a new one; fail loudly if the template doesn't have it. */
function swap(html, pattern, replacement, label) {
    if (!pattern.test(html)) throw new Error(`[seo] tag not found in index.html: ${label}`);
    return html.replace(pattern, () => replacement);
}
const metaName = (n) => new RegExp(`<meta\\s+name="${n}"[^>]*>`);
const metaProp = (p) => new RegExp(`<meta\\s+property="${p}"[^>]*>`);

/* the newest change time of a page's source file (and of its picture folder, if it has one), for sitemap <lastmod> */
function newest(path) {
    if (!existsSync(path)) return 0;
    const st = statSync(path);
    if (!st.isDirectory()) return st.mtimeMs;
    return readdirSync(path).reduce((m, f) => Math.max(m, newest(join(path, f))), st.mtimeMs);
}

function pageHtml(path, page) {
    const url = urlFor(path);
    const image = `${SITE.url}${SITE.image}`;
    let h = template;
    h = swap(h, /<title>[\s\S]*?<\/title>/, `<title>${escText(page.title)}</title>`, "title");
    h = swap(h, metaName("description"), `<meta name="description" content="${esc(page.description)}" />`, "description");
    h = swap(h, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`, "canonical");
    h = swap(h, metaProp("og:title"), `<meta property="og:title" content="${esc(page.title)}" />`, "og:title");
    h = swap(h, metaProp("og:description"), `<meta property="og:description" content="${esc(page.description)}" />`, "og:description");
    h = swap(h, metaProp("og:url"), `<meta property="og:url" content="${url}" />`, "og:url");
    h = swap(h, metaProp("og:image"), `<meta property="og:image" content="${image}" />`, "og:image");
    h = swap(h, metaName("twitter:title"), `<meta name="twitter:title" content="${esc(page.title)}" />`, "twitter:title");
    h = swap(h, metaName("twitter:description"), `<meta name="twitter:description" content="${esc(page.description)}" />`, "twitter:description");

    /* breadcrumb trail for inner pages (Home > Page) */
    if (path !== "/") {
        const crumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
                { "@type": "ListItem", position: 2, name: page.heading, item: url },
            ],
        };
        h = h.replace("</head>", () => `  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>\n</head>`);
    }

    /* what a visitor without JavaScript (or a simple crawler) gets: the page's main heading, summary and links */
    const links = Object.entries(PAGES).map(([p, v]) => `<li><a href="${urlFor(p)}">${escText(v.heading)}</a></li>`).join("");
    const fallback = `<noscript><h1>${escText(page.heading)}</h1><p>${escText(page.description)}</p><nav><ul>${links}</ul></nav></noscript>`;
    return h.replace('<div id="root"></div>', () => `<div id="root"></div>\n  ${fallback}`);
}

/* ── write one HTML file per page ── */
const srcPages = resolve(root, "src/pages");
const urls = [];
for (const [path, page] of Object.entries(PAGES)) {
    const html = pageHtml(path, page);
    writeFileSync(resolve(dist, path === "/" ? "index.html" : `${path.slice(1)}.html`), html);
    const changed = Math.max(newest(resolve(srcPages, page.file)), page.extraDir ? newest(resolve(root, "src", page.extraDir)) : 0, newest(resolve(root, "src/seo.js")));
    urls.push({ loc: urlFor(path), lastmod: new Date(changed || Date.now()).toISOString().slice(0, 10) });
}

/* ── sitemap.xml ── */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;
writeFileSync(resolve(dist, "sitemap.xml"), sitemap);

/* ── report ── */
for (const [path, page] of Object.entries(PAGES)) {
    const t = page.title.length, d = page.description.length;
    const warn = (t > 65 || d > 160) ? "  <-- too long, may be cut off on Google" : "";
    console.log(`[seo] ${path.padEnd(16)} title ${String(t).padStart(2)} chars, description ${String(d).padStart(3)} chars${warn}`);
}
console.log(`[seo] wrote ${urls.length} pages and sitemap.xml`);
