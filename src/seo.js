// src/seo.js
// One place for everything search engines read about each page: title, description, address in search results.
// It is used in two places:
//   1. in the browser (App.jsx calls applySeo on every page change), and
//   2. at build time (scripts/seo-build.mjs writes these into the HTML of each page, plus sitemap.xml).
// To change how a page appears on Google, edit the title/description below, then run  npm run build.

export const SITE = {
    url: "https://www.gugulotre.com", // the one address Google should treat as the real one (with www)
    name: "Gugulotre",
    image: "/og-image.jpg", // 1200 x 630 picture shown when the site is shared on WhatsApp, Facebook, LinkedIn
    imageAlt: "Gugulotre – The Creative Place",
};

/* Titles: keep under about 60 characters. Descriptions: keep under about 155 characters.
   `file` is the page's source file, used to date the page in sitemap.xml. */
export const PAGES = {
    "/": {
        title: "Gugulotre | Website, App & E-Commerce Development, Hyderabad",
        description: "Gugulotre builds fast websites, mobile apps and e-commerce stores for businesses in Hyderabad and beyond, with UI/UX and graphic design. Start your project.",
        heading: "We build digital futures",
        file: "Gugulotrehome.jsx",
    },
    "/about": {
        title: "About Gugulotre | Web & Product Development Team, Hyderabad",
        description: "Gugulotre is a web and product development team in Hyderabad. We design and build websites, apps and digital products on time, on scope and to a high standard.",
        heading: "About Gugulotre",
        file: "AboutPage.jsx",
    },
    "/services": {
        title: "Services | Web, App, UI/UX, E-Commerce & Design | Gugulotre",
        description: "Web development, mobile apps, UI/UX design, WordPress, e-commerce stores and graphic design from Gugulotre in Hyderabad, all done in-house.",
        heading: "Every service your brand needs online",
        file: "ServicesPage.jsx",
    },
    "/gallery": {
        title: "Gallery | Our Websites, Apps & Design Work | Gugulotre",
        description: "See what Gugulotre has made: websites, web apps, mobile apps, e-commerce stores, visiting cards, ID cards, package design and more. Browse by service.",
        heading: "See what we make before you start",
        file: "GalleryPage.jsx",
        extraDir: "assets/gallery", // new pictures also count as a change to this page
    },
    "/process": {
        title: "Our Process | From Idea to Live Product | Gugulotre",
        description: "How a Gugulotre project works, step by step: from the first idea to a live product, with clear communication and craftsmanship at every stage.",
        heading: "From idea to live product",
        file: "ProcessPage.jsx",
    },
    "/careers": {
        title: "Free Internship on Real Projects | Careers | Gugulotre",
        description: "Apply for a free internship at Gugulotre. Work on real client projects in web development, design, video editing, e-commerce and apps, and get a certificate.",
        heading: "Free internship on real projects at Gugulotre",
        file: "CareersPage.jsx",
    },
    "/contact": {
        title: "Contact Gugulotre | Start Your Project, Hyderabad",
        description: "Tell us about your project. Gugulotre in SR Nagar, Hyderabad replies within 24 hours with a clear plan. Call or WhatsApp +91 9392281448.",
        heading: "Let's build something extraordinary",
        file: "ContactPage.jsx",
    },
    "/privacy-policy": {
        title: "Privacy Policy | Gugulotre",
        description: "How Gugulotre collects, uses and protects the details you send us through our website, WhatsApp, email and internship applications.",
        heading: "Privacy policy",
        file: "PrivacyPolicyPage.jsx",
    },
};

/* Any address that is not a real page (shown as "Page not found"). Search engines are told to skip it. */
const NOT_FOUND = {
    title: "Page not found | Gugulotre",
    description: "This page does not exist. Go back to the Gugulotre home page.",
};

export const normalizePath = (pathname) => (pathname || "/").replace(/\/+$/, "") || "/";
export const urlFor = (path) => (path === "/" ? `${SITE.url}/` : `${SITE.url}${path}`);

/* ── Browser only: update the tags in <head> when the visitor moves to another page ── */
function setTag(selector, create, attrs) {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = document.createElement(create);
        document.head.appendChild(el);
    }
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

export function applySeo(pathname) {
    const path = normalizePath(pathname);
    const page = PAGES[path];
    const meta = page || NOT_FOUND;
    const image = `${SITE.url}${SITE.image}`;
    document.title = meta.title;
    setTag('meta[name="description"]', "meta", { name: "description", content: meta.description });
    setTag('meta[name="robots"]', "meta", { name: "robots", content: page ? "index, follow, max-image-preview:large" : "noindex, follow" });
    if (page) setTag('link[rel="canonical"]', "link", { rel: "canonical", href: urlFor(path) });
    else document.head.querySelector('link[rel="canonical"]')?.remove();
    setTag('meta[property="og:title"]', "meta", { property: "og:title", content: meta.title });
    setTag('meta[property="og:description"]', "meta", { property: "og:description", content: meta.description });
    setTag('meta[property="og:url"]', "meta", { property: "og:url", content: page ? urlFor(path) : SITE.url + "/" });
    setTag('meta[property="og:image"]', "meta", { property: "og:image", content: image });
    setTag('meta[name="twitter:title"]', "meta", { name: "twitter:title", content: meta.title });
    setTag('meta[name="twitter:description"]', "meta", { name: "twitter:description", content: meta.description });
}