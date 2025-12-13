import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import DoctorList from "./pages/DoctorList";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sosLoading, setSosLoading] = useState(false);

  const submitSearch = (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (q) navigate("/doctors", { state: { q } });
    setMobileOpen(false);
  };

  const handleSOS = () => {
    if (!("geolocation" in navigator)) {
      if (window.confirm("Location not supported. Call emergency (102)?")) window.location.href = "tel:102";
      return;
    }
    setSosLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSosLoading(false);
        const { latitude, longitude } = pos.coords;
        const confirmed = window.confirm(
          `Location found:\nLat: ${latitude.toFixed(5)}\nLon: ${longitude.toFixed(5)}\n\nCall emergency (102)?`
        );
        if (confirmed) window.location.href = "tel:102";
      },
      (err) => {
        setSosLoading(false);
        console.error("Geolocation error:", err);
        if (window.confirm("Unable to get location. Call emergency (102)?")) window.location.href = "tel:102";
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="app-root">
      {/* NAVBAR (green theme) */}
      <header className="topbar topbar--green" role="banner">
        <div className="topbar-inner container">
          {/* Left: brand */}
          <div className="brand-left">
            <Link to="/" className="brand-link" onClick={() => setMobileOpen(false)}>
              <span className="brand-title">FindMyDoctor</span>
            </Link>
          </div>

          {/* Center: search */}
          <div className="center-search" role="search">
            <form className="nav-search" onSubmit={submitSearch} aria-label="Search doctors">
              <input
                type="search"
                placeholder="Search doctors, speciality or hospital..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search"
                className="nav-search-input"
              />
              <button type="submit" className="btn search-btn" aria-label="Search">Search</button>
            </form>
          </div>

          {/* Right: links and actions */}
          <nav className={`nav ${mobileOpen ? "open" : ""}`} aria-label="Main navigation">
            <ul className="nav-links" role="menubar">
              <li role="none"><Link to="/" role="menuitem" onClick={() => setMobileOpen(false)}>Home</Link></li>
              <li role="none"><Link to="/doctors" role="menuitem" onClick={() => setMobileOpen(false)}>Doctors</Link></li>
              <li role="none"><Link to="/dashboard" role="menuitem" onClick={() => setMobileOpen(false)}>Dashboard</Link></li>
              <li role="none"><Link to="/login" role="menuitem" onClick={() => setMobileOpen(false)}>Login</Link></li>
            </ul>

            <div className="nav-actions">
              <button className="btn sos-btn" onClick={handleSOS} aria-pressed={sosLoading}>
                {sosLoading ? "Locating..." : "🚨 SOS"}
              </button>

              <button className="btn primary" onClick={() => { navigate("/doctors"); setMobileOpen(false); }}>
                Book Appointment
              </button>
            </div>
          </nav>

          <div className="mobile-toggle">
            <button
              className="hamburger"
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              <span className="ham-line" />
              <span className="ham-line" />
              <span className="ham-line" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/book/:id" element={<BookAppointment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {/* FOOTER — professional layout */}
      <footer className="site-footer site-footer--clean" role="contentinfo">
        <div className="container footer-grid">
          <div className="footer-col footer-brand">
            <div className="brand-title">FindMyDoctor</div>
            <p className="muted">Comprehensive medical search & booking — demo</p>
            <div className="contact" aria-label="Contact" style={{ marginTop: 12 }}>
              <div className="muted">📞 <a href="tel:+911234567890">+91 12345 67890</a></div>
              <div className="muted">✉️ <a href="mailto:help@findmydoctor.example">help@findmydoctor.example</a></div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul className="footer-links-list">
              <li><Link to="/doctors">Find Doctors</Link></li>
              <li><a href="#services">Services</a></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links-list">
              <li><a href="#about">About</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#partners">Partners</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Stay updated</h4>
            <form className="footer-newsletter" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
              <label htmlFor="footer-nl" className="sr-only">Email</label>
              <input id="footer-nl" className="nav-search-input" placeholder="Your email address" />
              <button className="btn footer-sub" type="submit">Subscribe</button>
            </form>

            <div className="socials" style={{ marginTop: 12 }}>
              <a className="social-link" href="#" aria-label="Twitter">Twitter</a>
              <a className="social-link" href="#" aria-label="Instagram">Instagram</a>
              <a className="social-link" href="#" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="footer-legal">
          <div className="container footer-legal-inner">
            <div className="muted">© {new Date().getFullYear()} FindMyDoctor — Demo. All rights reserved.</div>
            <div className="legal-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Use</a>
              <a href="#security">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
