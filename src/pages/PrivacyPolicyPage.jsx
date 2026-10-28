import { C } from "../components/theme";

/* ── Facts used in the policy. Change them here and the whole page updates. ── */
const UPDATED = "28 October 2026";
const COMPANY = "Gugulotre – The Creative Place";
const EMAIL = "gugulotre@gmail.com";
const PHONE = "+91 9392281448";
const WA_LINK = "https://wa.me/919392281448";
const ADDRESS = "SR Nagar, Hyderabad, India";

const mail = <a className="pp-link" href={`mailto:${EMAIL}`}>{EMAIL}</a>;
const wa = <a className="pp-link" href={WA_LINK} target="_blank" rel="noopener noreferrer">{PHONE}</a>;

/* Each block is a paragraph, a bulleted list ({ ul }) or a numbered list ({ ol }) — numbered only where the order matters. */
const SECTIONS = [
    {
        id: "who-we-are", title: "Who we are",
        body: [
            `${COMPANY} is a digital creative agency based in ${ADDRESS}. We build websites and apps, and we offer design, e-commerce and related creative services.`,
            "This policy explains which personal details we collect when you contact us through our website, WhatsApp, email or our ads, what we do with them, and the choices you have.",
        ],
    },
    {
        id: "what-we-collect", title: "What we collect",
        body: [
            "We collect only what you choose to send us:",
            {
                ul: [
                    "Your name and phone number, and your email address if you share it.",
                    "What you are asking about, including any messages, files or links you send us.",
                    "If you apply for an internship or a job: the details you enter in the form and the resume you upload.",
                ]
            },
            "Our website does not ask you to create an account. Our pages load fonts from Google Fonts, so your browser contacts Google’s servers when you visit.",
        ],
    },
    {
        id: "how-you-reach-us", title: "How you reach us",
        body: [
            {
                ul: [
                    "WhatsApp. When you tap a WhatsApp button on our website or in one of our ads, a chat opens with our team. Your name and number are visible to us in that chat.",
                    "Contact form. The form prepares a WhatsApp message or an email on your own device. Nothing is sent until you press send in your own app.",
                    "Email. We receive the email you send us.",
                    "Applications. If you apply through our website, your details and resume are emailed to our team (Gmail). If you choose \"Send on WhatsApp\" instead, a chat opens with your details already typed, and nothing is sent until you press send. If you attached a resume, it is stored on our server and the message contains a private link to it; the file is deleted automatically after 30 days.",
                ]
            },
        ],
    },
    {
        id: "how-we-use-it", title: "How we use your details",
        body: [
            {
                ul: [
                    "To reply to your enquiry and understand what you need.",
                    "To prepare quotes and to plan and carry out the work you ask us for.",
                    "To follow up on your enquiry and on any related work you ask us about.",
                    "To keep records of our work, invoices and payments.",
                    "To consider your internship or job application.",
                ]
            },
            "We do not sell your details, and we do not use them for anything unrelated to your enquiry. You can tell us at any time to stop contacting you.",
        ],
    },
    {
        id: "where-it-is-kept", title: "Where your details are kept",
        body: [
            "We keep your name, phone number and enquiry in our internal customer system, so the right person on our team can follow up with you. Only our team can open it.",
            "When you message one of our team’s WhatsApp Business numbers, for example after tapping one of our ads, WhatsApp passes the chat to our internal customer system. It saves your name, your phone number (when WhatsApp shares it), the ad you came from and the first message you send (up to the first 300 characters), and creates an enquiry for the team member who owns that number. It does not copy your earlier chats, the messages you send after the first one, or any photos, videos or files.",
            "Chats take place on WhatsApp, which is run by Meta. WhatsApp handles those messages under its own terms and privacy policy.",
        ],
    },
    {
        id: "sharing", title: "Who we share them with",
        body: [
            "We do not sell your details or hand them to anyone else for their own use. We share them only with the services that help us run our business, and only so they can do that job:",
            {
                ul: [
                    "Messaging services such as WhatsApp (Meta), and email providers, to send and receive messages.",
                    "Hosting and software providers that run our website and our internal systems.",
                    "Authorities, if the law requires us to.",
                ]
            },
        ],
    },
    {
        id: "how-long", title: "How long we keep them",
        body: [
            "We keep your details in our records after the work is finished, so we can help you if you contact us again and deal with anything still pending, such as a payment or unfinished work.",
            "After the work is finished, we contact you only if something is still pending, or if you contact us first.",
            "You can ask us to delete your details at any time. See “How to ask us to delete your data” below.",
            "We keep applications only as long as we need them to consider the application.",
        ],
    },
    {
        id: "your-choices", title: "Your choices",
        body: [
            "You can ask us to:",
            {
                ul: [
                    "tell you what details we hold about you,",
                    "correct anything that is wrong,",
                    "delete your details, or",
                    "stop contacting you.",
                ]
            },
            <>Send your request using the contact details at the end of this page. We will reply as soon as we can.</>,
        ],
    },
    {
        id: "data-deletion", title: "How to ask us to delete your data",
        body: [
            {
                ol: [
                    <>Send a WhatsApp message to {wa}, or an email to {mail}.</>,
                    "Write “Delete my data” and include the phone number or email address you used with us.",
                    "We will find your details, delete them from our systems, and confirm when it is done.",
                ]
            },
            "We may keep a note that you made a deletion request, and any record the law requires us to keep, such as an invoice.",
        ],
    },
    {
        id: "security", title: "Keeping your details safe",
        body: [
            "We limit access to your details to the team members who need them to help you, and we take reasonable steps to protect them. No way of storing or sending information is completely secure, so we cannot promise absolute security.",
        ],
    },
    {
        id: "children", title: "Children",
        body: [
            "Our services are for businesses and adults. We do not knowingly collect details from anyone under 18. If you think a child has sent us their details, contact us and we will delete them.",
        ],
    },
    {
        id: "changes", title: "Changes to this policy",
        body: [
            "If we change this policy, we will update the date at the top of this page. If the change is significant, we will say so here.",
        ],
    },
    {
        id: "contact", title: "Contact us",
        body: [
            "For questions, requests or complaints about your details:",
            {
                ul: [
                    "Privacy contact: Gugulotre team",
                    <>{COMPANY}, {ADDRESS}</>,
                    <>Email: {mail}</>,
                    <>WhatsApp: {wa}</>,
                ]
            },
        ],
    },
];

const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

function Block({ block }) {
    if (typeof block === "string" || (block && block.type)) return <p>{block}</p>;
    if (block.ul) return <ul>{block.ul.map((t, i) => <li key={i}>{t}</li>)}</ul>;
    if (block.ol) return <ol>{block.ol.map((t, i) => <li key={i}>{t}</li>)}</ol>;
    return null;
}

export default function PrivacyPolicyPage({ setPage }) {
    return (
        <div className="pp-page" style={{ width: "100%", minWidth: 0, paddingTop: 70, fontFamily: "'Outfit',sans-serif" }}>
            <style>{`
                .pp-hero { background: ${C.purpleDark}; position: relative; overflow: hidden;
                    padding: clamp(2.2rem,6vw,4.5rem) 5% clamp(2.2rem,5vw,4rem);
                    background-image: radial-gradient(circle at 75% 25%, rgba(255,0,107,0.14), transparent 50%), radial-gradient(circle at 5% 85%, rgba(90,157,254,0.22), transparent 50%); }
                .pp-body { background: ${C.cream}; padding: clamp(2.2rem,5vw,4.5rem) 5% clamp(3rem,6vw,5rem); }
                .pp-layout { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: minmax(0,1fr); gap: 2rem; }
                @media (min-width: 1024px) { .pp-layout { grid-template-columns: 230px minmax(0,1fr); gap: 4rem; } }

                .pp-toc { display: flex; flex-direction: column; align-items: flex-start; gap: 0.1rem; }
                .pp-toc-title { font-family: 'Syne',sans-serif; font-weight: 700; font-size: 0.8rem; color: ${C.ink}; margin: 0 0 0.6rem; }
                .pp-toc button { background: none; border: none; padding: 0.3rem 0; text-align: left; cursor: pointer;
                    font-family: 'Outfit',sans-serif; font-size: 0.88rem; color: ${C.inkSoft}; line-height: 1.4; transition: color 0.2s; }
                .pp-toc button:hover { color: ${C.coral}; }

                .pp-section { scroll-margin-top: 90px; padding: 0 0 2rem; margin: 0 0 2rem; border-bottom: 1px solid rgba(20,22,58,0.12); }
                .pp-section:last-of-type { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                .pp-section h2 { font-family: 'Bebas Neue',sans-serif; font-weight: 400; font-size: clamp(1.7rem,3vw,2.2rem);
                    line-height: 1; color: ${C.ink}; margin: 0 0 1rem; }
                .pp-section p, .pp-section li { font-size: 0.98rem; line-height: 1.8; color: ${C.ink}; max-width: 68ch; }
                .pp-section p { margin: 0 0 0.9rem; }
                .pp-section p:last-child { margin-bottom: 0; }
                .pp-section ul, .pp-section ol { margin: 0 0 0.9rem; padding-left: 1.3rem; }
                .pp-section li { margin-bottom: 0.45rem; padding-left: 0.2rem; }
                .pp-section ul li::marker { color: ${C.coral}; }
                .pp-section ol li::marker { color: ${C.coral}; font-weight: 600; }
                .pp-link { color: ${C.purple}; font-weight: 500; text-underline-offset: 3px; word-break: break-word; }
                .pp-link:hover { color: ${C.coral}; }

                .pp-btn { display: inline-flex; align-items: center; justify-content: center; margin-top: 1.4rem; padding: 0.8rem 1.8rem;
                    border-radius: 50px; border: none; cursor: pointer; background: ${C.coral}; color: #fff;
                    font-family: 'Syne',sans-serif; font-weight: 700; font-size: 0.88rem; transition: background 0.2s; }
                .pp-btn:hover { background: ${C.coralSoft}; }
                .pp-btn:focus-visible, .pp-toc button:focus-visible, .pp-link:focus-visible { outline: 3px solid rgba(255,0,107,0.45); outline-offset: 3px; }
            `}</style>

            {/* ══ HERO ══ */}
            <section className="pp-hero">
                <div style={{ position: "relative", zIndex: 2, maxWidth: 700 }}>
                    <h1 style={{
                        fontFamily: "'Bebas Neue',sans-serif", margin: 0, color: C.cream, fontWeight: 400,
                        fontSize: "clamp(2.4rem,6.5vw,5rem)", lineHeight: 0.98,
                    }}>
                        PRIVACY POLICY
                    </h1>
                    <p style={{ color: "rgba(247,243,236,0.78)", fontSize: "clamp(0.9rem,1.5vw,1.02rem)", lineHeight: 1.75, maxWidth: 560, margin: "1.1rem 0 0" }}>
                        We use your details to answer your enquiry and do the work you ask for. We don’t sell them.
                    </p>
                    <p style={{ color: "rgba(247,243,236,0.55)", fontSize: "0.82rem", margin: "1rem 0 0" }}>
                        Last updated {UPDATED}
                    </p>
                </div>
            </section>

            {/* ══ POLICY ══ */}
            <section className="pp-body">
                <div className="pp-layout">
                    <nav className="pp-toc" aria-label="On this page">
                        <p className="pp-toc-title">On this page</p>
                        {SECTIONS.map((s) => (
                            <button key={s.id} type="button" onClick={() => scrollToId(s.id)}>{s.title}</button>
                        ))}
                    </nav>

                    <article>
                        {SECTIONS.map((s) => (
                            <section key={s.id} id={s.id} className="pp-section">
                                <h2>{s.title}</h2>
                                {s.body.map((b, i) => <Block key={i} block={b} />)}
                                {s.id === "contact" && setPage && (
                                    <button type="button" className="pp-btn" onClick={() => setPage("Contact")}>Go to the contact page</button>
                                )}
                            </section>
                        ))}
                    </article>
                </div>
            </section>
        </div>
    );
}