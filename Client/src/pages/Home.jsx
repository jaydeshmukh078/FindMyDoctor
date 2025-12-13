import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorsData from "../data/doctors"; // your dummy data
import "./Home.css";

/**
 * Home.jsx (content-only)
 * - Image-free professional home page
 * - DOES NOT include navbar/footer (they are in App.jsx)
 */

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [results, setResults] = useState({ doctors: [], articles: [] });
  const [sosLoading, setSosLoading] = useState(false);
  const [coordsText, setCoordsText] = useState("");
  const [showBhopal, setShowBhopal] = useState(false);

  const sampleArticles = useMemo(() => [
    { id: "a1", title: "5 Ways to Boost Immunity", summary: "Practical daily tips to strengthen immunity." },
    { id: "a2", title: "Skin Care Basics", summary: "Daily routine and sunscreen guide." },
    { id: "a3", title: "Heart Health Essentials", summary: "Prevention, lifestyle and warning signs." },
    { id: "a4", title: "Oral Hygiene Guide", summary: "How to keep your teeth and gums healthy." }
  ], []);

  const suggestions = useMemo(() => {
    const s = new Set();
    (doctorsData || []).forEach(d => {
      if (d.speciality) s.add(d.speciality);
      if (d.hospital) s.add(d.hospital);
    });
    return Array.from(s).slice(0, 12);
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setResults({ doctors: [], articles: [] });

    const matchedDoctors = (doctorsData || [])
      .filter(d => {
        const hay = `${d.name || ''} ${d.speciality || ''} ${d.hospital || ''} ${d.about || ''}`.toLowerCase();
        return hay.includes(q);
      })
      .filter(d => (onlineOnly ? d.online : true))
      .slice(0, 8);

    const matchedArticles = sampleArticles.filter(a => {
      return a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q);
    });

    setResults({ doctors: matchedDoctors, articles: matchedArticles });
  }, [query, onlineOnly, sampleArticles]);

  const handleSOS = () => {
    if (!('geolocation' in navigator)) {
      if (window.confirm('Geolocation not available. Call emergency (102)?')) window.location.href = 'tel:102';
      return;
    }

    setSosLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setSosLoading(false);
        const { latitude, longitude } = pos.coords;
        const txt = `Lat: ${latitude.toFixed(5)} , Lon: ${longitude.toFixed(5)}`;
        setCoordsText(txt);
        if (window.confirm(`Location found:\n${txt}\n\nCall emergency (102)?`)) window.location.href = 'tel:102';
      },
      err => {
        setSosLoading(false);
        console.error(err);
        if (window.confirm('Unable to fetch location. Call emergency (102)?')) window.location.href = 'tel:102';
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const goDoctors = (opts = {}) => navigate('/doctors', { state: opts });
  const openDoctor = (d) => navigate(`/doctors/${d.id}`, { state: { doctor: d } });

  return (
    <main className="home-wrap">
      <header className="hero-hero">
        <div className="hero-overlay">
          <div className="hero-container">
            <h1 className="hero-title">Stay at Home. Consult Doctors Online.</h1>
            <p className="hero-sub">Fast appointments, trusted specialists, and instant teleconsultations.</p>

            <div className="hero-search-row">
              <input
                className="hero-search"
                placeholder="Search by disease, symptom, speciality or hospital — e.g. fever, cardiologist"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search health"
              />
              <button className="btn-hero" onClick={() => goDoctors({ q: query.trim() })}>
                Search
              </button>
            </div>

            <div className="trending">
              <strong>Trending Topics:</strong>
              <div className="trending-list">
                {["Celiac Disease","Bipolar Disorder","Fungal Infection","Mental Disorders","Heart Disease","Diabetes"].map(t => (
                  <button key={t} className="trend-chip" onClick={() => setQuery(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="hero-actions">
              <button className="action sos" onClick={handleSOS}>{sosLoading ? "Locating..." : "🚨 SOS"}</button>
              <button className="action" onClick={() => goDoctors()}>📅 Book Appointment</button>
              <button className="action" onClick={() => goDoctors({ focus: 'health-check' })}>🩺 Health Checkup</button>
              <button className="action" onClick={() => setShowBhopal(true)}>🏥 Find Bhopal Hospitals</button>
            </div>

            {coordsText && <div className="coords-note">{coordsText}</div>}
            <div className="hero-note">Quick update: <span className="live-pill">3 mins ago</span> 25 year old Male from Bangalore just asked about Diet</div>
          </div>
        </div>
      </header>

      <div className="main-container">
        {/* Services */}
        <section className="services-strip" id="services">
          <div className="section-head">
            <h2>Book an appointment for an in-clinic consultation</h2>
            <p className="muted">Find experienced doctors across all specialities</p>
          </div>

          <div className="services-cards">
            <div className="svc-card">
              <h4>Dentist</h4>
              <p className="muted">Teething troubles? Schedule a dental checkup</p>
            </div>
            <div className="svc-card">
              <h4>Gynecologist / Obstetrician</h4>
              <p className="muted">Women’s health, pregnancy & infertility treatments</p>
            </div>
            <div className="svc-card">
              <h4>Dietitian / Nutrition</h4>
              <p className="muted">Guidance on weight management & sports nutrition</p>
            </div>
            <div className="svc-card">
              <h4>Physiotherapist</h4>
              <p className="muted">Pulled a muscle? Get treatment from a trained therapist</p>
            </div>
          </div>
        </section>

        {/* Specialities */}
        <section className="specialities" id="specialities">
          <div className="section-head">
            <h2>Consult top doctors online for any health concern</h2>
            <p className="muted">Private online consultations with verified doctors</p>
          </div>
          <div className="icons-row">
            {["Period / Pregnancy","Acne & Skin","Performance Issues","Cold / Fever","Child Care","Depression & Anxiety"].map((s, i) => (
              <div key={i} className="spec-item">
                <div className="spec-icon">{s.split(" ")[0].slice(0,1)}</div>
                <h5>{s}</h5>
                <button className="link-small" onClick={() => setQuery(s)}>CONSULT NOW</button>
              </div>
            ))}
          </div>
        </section>

        {/* Search row */}
        <section className="search-row">
          <div className="location-inputs">
            <input placeholder="Bhopal (auto-detect available)" className="location-field" />
            <input placeholder="Search doctors, clinics, hospitals, tests..." className="query-field" value={query} onChange={(e)=>setQuery(e.target.value)} />
            <button className="btn primary" onClick={()=>goDoctors({ q: query.trim() })}>Search</button>
          </div>
        </section>

        {/* Features */}
        <section className="features-cards">
          <div className="feature-card">
            <div className="icon-box">📹</div>
            <h4>Instant Video Consultation</h4>
            <p className="muted">Connect with a doctor within 60 seconds</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">🔍</div>
            <h4>Find Doctors Near You</h4>
            <p className="muted">Confirmed appointments, verified doctors</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">🧪</div>
            <h4>Lab Tests</h4>
            <p className="muted">Safe and trusted lab test partners</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">🏥</div>
            <h4>Surgeries</h4>
            <p className="muted">Reliable surgical centers and post-op care</p>
          </div>
        </section>

        {/* Special grid */}
        <section className="special-grid">
          <h3>Popular specialities</h3>
          <div className="spec-grid">
            {suggestions.map((s, idx) => (
              <div key={idx} className="spec-grid-item" onClick={() => setQuery(s)}>
                <div className="spec-blob">{s[0]}</div>
                <div className="spec-text">{s}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section className="articles-section" id="articles">
          <h3>Health Guides & Articles</h3>
          <div className="article-list">
            {sampleArticles.map(a => (
              <article key={a.id} className="article-card">
                <h4>{a.title}</h4>
                <p className="muted">{a.summary}</p>
                <div className="article-actions">
                  <button className="btn small ghost" onClick={()=>alert(a.title + "\n\n" + a.summary)}>Read</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section" id="faq">
          <h3>Frequently asked questions</h3>
          <details><summary>How to book an appointment?</summary><p>Search a doctor, open profile and click Book. Booking is saved locally in this demo.</p></details>
          <details><summary>Is teleconsultation available?</summary><p>Yes — select an online doctor and choose a slot for video consultation.</p></details>
          <details><summary>How is my data handled?</summary><p>Demo stores data locally. For production use secure backend & auth.</p></details>
        </section>

      </div>

      {/* Bhopal modal */}
      {showBhopal && (
        <div className="modal-backdrop" onClick={() => setShowBhopal(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-head">
              <h3>Best Hospitals in Bhopal</h3>
              <button className="close" onClick={() => setShowBhopal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-list">
                <ol>
                  <li>AIIMS Bhopal</li>
                  <li>Hamidia Hospital</li>
                  <li>Sultania Zanana Hospital</li>
                  <li>JK Hospital</li>
                  <li>Colonel Clinic (example)</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}