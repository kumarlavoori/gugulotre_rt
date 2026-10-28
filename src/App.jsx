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
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import './index.css';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [targetService, setTargetService] = useState(null);

  useEffect(() => {
    const titles = {
      "/": "Gugulotre | Home",
      "/about": "Gugulotre | About",
      "/services": "Gugulotre | Services",
      "/process": "Gugulotre | Process",
      "/careers": "Gugulotre | Careers",
      "/contact": "Gugulotre | Contact",
      "/privacy-policy": "Gugulotre | Privacy Policy",
    };
    document.title = titles[location.pathname] || "Gugulotre";
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
    const routes = { Home: "/", About: "/about", Services: "/services", Process: "/process", Careers: "/careers", Contact: "/contact", Privacy: "/privacy-policy" };
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
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage setPage={handleSetPage} />} />
          <Route path="/contact" element={
            <ContactPage
              setPage={handleSetPage}
              targetSection={targetSection}
              onSectionHandled={() => setTimeout(() => setTargetSection(null), 500)}
            />}
          />
        </Routes>
      </main>
      <Footer setPage={handleSetPage} goToService={handleGoToService} goToContactForm={goToContactForm} />
    </>
  );
}