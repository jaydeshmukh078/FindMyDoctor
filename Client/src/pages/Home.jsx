import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sosLoading, setSosLoading] = useState(false);
  const [coordsText, setCoordsText] = useState("");
  const [showBhopal, setShowBhopal] = useState(false);

  /* ---------- STATIC ARTICLES (demo content) ---------- */
  const articles = useMemo(
    () => [
      { id: 1, title: "5 Ways to Boost Immunity", summary: "Daily habits to strengthen immunity." },
      { id: 2, title: "Skin Care Basics", summary: "Simple routine for healthy skin." },
      { id: 3, title: "Heart Health Essentials", summary: "Lifestyle tips for heart health." },
    ],
    []
  );

  /* ---------- FETCH DOCTORS FROM BACKEND ---------- */
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await API.get("/doctors");
        setDoctors(res.data || []);
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);














  /* ---------- SEARCH HELPERS ---------- */
  const suggestions = useMemo(() => {
    const set = new Set();
    doctors.forEach((d) => {
      if (d.specialization) set.add(d.specialization);
      if (d.location) set.add(d.location);
    });
    return Array.from(set).slice(0, 12);
  }, [doctors]);

  const goDoctors = (opts = {}) =>
    navigate("/doctors", { state: opts });
























  /* ---------- SOS ---------- */
  const handleSOS = () => {
    if (!navigator.geolocation) {
      if (window.confirm("Call emergency (102)?")) window.location.href = "tel:102";
      return;
    }

    setSosLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSosLoading(false);
        const txt = `Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`;
        setCoordsText(txt);
        if (window.confirm(`${txt}\nCall emergency (102)?`))
          window.location.href = "tel:102";
      },
      () => {
        setSosLoading(false);
        if (window.confirm("Unable to detect location. Call emergency (102)?"))
          window.location.href = "tel:102";
      }
    );
  };

  return (
    <main className="home-wrap">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <h1>Consult Trusted Doctors Online</h1>
          <p>Search, compare and book appointments with verified doctors.</p>
























          

          <div className="hero-search">
            <input
              placeholder="Search by speciality, hospital or location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={() => goDoctors({ q: query })}>Search</button>
          </div>


































          <div className="hero-actions">
            <button className="danger" onClick={handleSOS}>
              {sosLoading ? "Locating..." : "🚨 SOS"}
            </button>
            <button onClick={() => goDoctors()}>Book Appointment</button>
            <button onClick={() => setShowBhopal(true)}>Find Bhopal Hospitals</button>
          </div>

          {coordsText && <div className="coords">{coordsText}</div>}
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <div className="container">
        {/* SERVICES */}
        <section>
          <h2>In-Clinic Consultation</h2>
          <p className="muted">Book appointments across major medical specialities</p>

          <div className="card-grid">
            {["Dentist", "Gynecologist", "Dietitian", "Physiotherapist"].map((s) => (
              <div key={s} className="card">
                <h4>{s}</h4>
                <p>Consult experienced {s.toLowerCase()}s</p>
              </div>
            ))}
          </div>
        </section>

        {/* SPECIALITIES FROM BACKEND */}
        <section>
          <h2>Popular Specialities</h2>

          {loading ? (
            <p className="muted">Loading doctors...</p>
          ) : (
            <div className="spec-grid">
              {suggestions.map((s) => (
                <div key={s} className="spec-item" onClick={() => setQuery(s)}>
                  <div className="spec-icon">{s[0]}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ARTICLES */}
        <section>
          <h2>Health Articles</h2>
          <div className="article-grid">
            {articles.map((a) => (
              <article key={a.id} className="article">
                <h4>{a.title}</h4>
                <p>{a.summary}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2>FAQs</h2>
          <details>
            <summary>How do I book an appointment?</summary>
            <p>Search a doctor, select a slot and confirm booking.</p>
          </details>
          <details>
            <summary>Is online consultation available?</summary>
            <p>Yes, choose doctors marked as online.</p>
          </details>
        </section>
      </div>

      {/* ================= MODAL ================= */}
      {showBhopal && (
        <div className="modal-backdrop" onClick={() => setShowBhopal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Top Hospitals in Bhopal</h3>
            <ol>
              <li>AIIMS Bhopal</li>
              <li>Hamidia Hospital</li>
              <li>JK Hospital</li>
            </ol>
            <button onClick={() => setShowBhopal(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
