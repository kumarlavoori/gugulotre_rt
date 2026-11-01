import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import Gugulotrehome from './pages/Gugulotrehome';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProcessPage from './pages/ProcessPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import GalleryPage from './pages/GalleryPage';
import { applySeo } from './seo';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import './index.css';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [targetService, setTargetService] = useState(null);

  // Title, description, address and share tags for the current page (all the text lives in src/seo.js)
  useEffect(() => {
    applySeo(location.pathname);
  }, [location.pathname]);


  const handleGoToService = (serviceId) => {
    setTargetService(serviceId);
    navigate("/services");
    // No scroll here — ServicesPage handles it via useLayoutEffect
  };
  // Add this helper function inside App():
  const [targetSection, setTargetSection] = useState(null);

  const goToContactForm = () => {
    setTargetSection("contact-form");
    navigate("/contact");
  };

  const goToProcessPipeline = () => {
    setTargetSection("process-pipeline");
    navigate("/process");
  };

  const handleSetPage = (p) => {
    const routes = { Home: "/", About: "/about", Services: "/services", Gallery: "/gallery", Process: "/process", Careers: "/careers", Contact: "/contact", Privacy: "/privacy-policy" };
    setTargetSection(null); // clear any target so page goes to top
    navigate(routes[p] || "/");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <>
      <Cursor />
      <Navbar page={location.pathname} setPage={handleSetPage} goToContactForm={goToContactForm} />
      <main>
        <Routes>
          <Route path="/" element={<Gugulotrehome setPage={handleSetPage} goToService={handleGoToService} goToContactForm={goToContactForm} goToProcessPipeline={goToProcessPipeline} />} />
          <Route path="/about" element={<AboutPage setPage={handleSetPage} goToContactForm={goToContactForm} />} />
          <Route path="/services" element={
            <ServicesPage
              setPage={handleSetPage}
              targetService={targetService}
              onServiceHandled={() => setTimeout(() => setTargetService(null), 500)}
              goToContactForm={goToContactForm}
              goToProcessPipeline={goToProcessPipeline}
            />}
          />
          <Route path="/process" element={
            <ProcessPage
              setPage={handleSetPage}
              goToContactForm={goToContactForm}
              targetSection={targetSection}
              onSectionHandled={() => setTimeout(() => setTargetSection(null), 500)}
            />}
          />
          <Route path="/gallery" element={<GalleryPage goToContactForm={goToContactForm} />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage setPage={handleSetPage} />} />
          <Route path="/contact" element={
            <ContactPage
              setPage={handleSetPage}
              targetSection={targetSection}
              onSectionHandled={() => setTimeout(() => setTargetSection(null), 500)}
            />}
          />
          <Route path="*" element={
            <section style={{ background: "#1D2060", padding: "calc(70px + 5rem) 5% 6rem", minHeight: "70vh" }}>
              <div style={{ maxWidth: 1360, margin: "0 auto" }}>
                <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: "clamp(3rem,8vw,6rem)", lineHeight: 0.95, color: "#F7F3EC", margin: "0 0 1rem" }}>
                  PAGE NOT FOUND.
                </h1>
                <p style={{ fontFamily: "'Outfit',sans-serif", color: "rgba(247,243,236,0.7)", fontSize: "1rem", lineHeight: 1.75, maxWidth: 460, margin: "0 0 1.6rem" }}>
                  This page does not exist or has moved. Go back to the home page to find what you need.
                </p>
                <a href="/" onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; e.preventDefault(); handleSetPage("Home"); }}
                  style={{ display: "inline-block", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.88rem", background: "#FF006B", color: "#fff", padding: "0.8rem 1.9rem", borderRadius: 50, textDecoration: "none", boxShadow: "0 6px 22px rgba(255, 0, 107,0.35)" }}>
                  Back to home
                </a>
              </div>
            </section>
          } />
        </Routes>
      </main>
      <Footer setPage={handleSetPage} goToService={handleGoToService} goToContactForm={goToContactForm} />
    </>
  );
}