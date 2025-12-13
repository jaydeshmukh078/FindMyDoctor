import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import doctorsData from "../data/doctors";
import "./DoctorProfile.css";

/**
 * DoctorProfile.jsx
 * - Expects navigation state: location.state.doctor (preferred)
 * - Falls back to finding doctor in local doctorsData by :id
 * - Offers slot click navigation to /book/:id with prefill {date, time}
 * - Contact buttons (tel, sms), share, download vCard
 */

function DoctorProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [showMap, setShowMap] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, text: "" });

  useEffect(() => {
    if (doctor) return;
    if (!paramId) return;

    // try to find in local dummy data
    const found = doctorsData.find(
      (d) => String(d.id) === String(paramId) || String(d._id) === String(paramId)
    );
    if (found) setDoctor(found);
  }, [paramId, doctor]);

  useEffect(() => {
    // load reviews for this doctor from localStorage (key: reviews_<doctorId>)
    if (!doctor) return;
    const key = `reviews_${doctor.id || doctor._id || "unknown"}`;
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    setReviews(saved);
  }, [doctor]);

  function saveReviewLocally() {
    if (!doctor) return;
    const key = `reviews_${doctor.id || doctor._id || "unknown"}`;
    const list = [ { ...newReview, date: new Date().toISOString() }, ...reviews ];
    localStorage.setItem(key, JSON.stringify(list));
    setReviews(list);
    setNewReview({ name: "", rating: 5, text: "" });
  }

  // speciality-based advice/prescription (can be extended)
  function getAdvice(speciality) {
    switch (speciality) {
      case "Cardiologist":
        return "Limit salt, avoid heavy meals before sleep, and get BP & cholesterol checked monthly.";
      case "Dermatologist":
        return "Use sunscreen daily, avoid harsh exfoliants, keep skin moisturized and consult for persistent rashes.";
      case "Gynecologist":
        return "Keep regular prenatal visits, maintain iron-rich diet, and follow screening guidelines.";
      case "Dentist":
        return "Brush twice daily, floss, limit sugary snacks and visit every 6 months.";
      default:
        return "Maintain a balanced lifestyle, hydrate well, and follow periodic health checkups.";
    }
  }

  // slot click -> navigate to booking with prefilled date/time
  function handleSlotClick(slot) {
    if (!doctor) return;
    const [d, t] = slot.split(" ");
    navigate(`/book/${doctor.id || doctor._id}`, {
      state: { doctor, prefill: { date: d, time: t } },
    });
  }

  // Call / SMS / Share / vCard
  function handleCall() {
    if (!doctor || !doctor.phone) {
      alert("Phone number not available");
      return;
    }
    window.location.href = `tel:${doctor.phone}`;
  }

  function handleSMS() {
    if (!doctor || !doctor.phone) {
      alert("Phone number not available");
      return;
    }
    window.location.href = `sms:${doctor.phone}?body=Hello%20${encodeURIComponent(doctor.name || "")}`;
  }

  async function handleShare() {
    const shareData = {
      title: `Doctor: ${doctor?.name}`,
      text: `${doctor?.name} — ${doctor?.speciality} at ${doctor?.hospital}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      // fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert("Profile link copied to clipboard");
      } catch {
        alert("Unable to share. Please copy the URL manually.");
      }
    }
  }

  function downloadVCard() {
    if (!doctor) return;
    // minimal vCard
    const nameParts = (doctor.name || "").split(" ");
    const first = nameParts.shift() || "";
    const last = nameParts.join(" ") || "";
    const phone = doctor.phone || "";
    const org = doctor.hospital || "";
    const title = doctor.speciality || "";
    const email = doctor.email || "";

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${last};${first};;;`,
      `FN:${doctor.name}`,
      `ORG:${org}`,
      `TITLE:${title}`,
      `TEL;TYPE=WORK,VOICE:${phone}`,
      email ? `EMAIL;TYPE=PREF,INTERNET:${email}` : "",
      `ADR;TYPE=WORK:;;${org};;;;`,
      `NOTE:${doctor.about || ""}`,
      "END:VCARD",
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(doctor.name || "doctor").replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (!doctor) {
    return (
      <div className="profile-page full">
        <div className="container">
          <h2>Doctor not found</h2>
          <p>Please go back to the doctors list.</p>
          <Link to="/doctors" className="btn ghost">Back to Doctors</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page full">
      <div className="container">

        {/* banner */}
        <div className="profile-banner">
          <img src={doctor.banner || doctor.image} alt={`${doctor.name} banner`} />
        </div>

        <div className="profile-grid">

          {/* left column: main card */}
          <aside className="profile-left">
            <div className="profile-card-large">
              <div className="avatar-wrap">
                <img src={doctor.image} alt={doctor.name} />
              </div>

              <div className="basic">
                <h1>{doctor.name}</h1>
                <p className="speciality">{doctor.speciality}</p>
                <p className="hospital">{doctor.hospital}</p>

                <div className="stats">
                  <div><span>Experience </span><strong>{doctor.experience}</strong></div>
                  <div><span>Fee </span><strong>{doctor.fee}</strong></div>
                  <div><span>Rating </span><strong>{doctor.rating || "4.5"} ⭐</strong></div>
                </div>

                <p className="about-large">{doctor.about}</p>

                <div className="action-row">
                  <button className="btn primary" onClick={() => navigate(`/book/${doctor.id}`, { state: { doctor } })}>
                    Book Appointment
                  </button>

                  <button className="btn ghost" onClick={handleCall}>
                    Call
                  </button>

                  <button className="btn ghost" onClick={handleSMS}>
                    Message
                  </button>

                  <button className="btn ghost" onClick={handleShare}>
                    Share
                  </button>

                  <button className="btn ghost" onClick={downloadVCard}>
                    Download Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Services / Expertise */}
            <div className="panel">
              <h3>Services & Expertise</h3>
              <ul className="services">
                {(doctor.services || [
                  "Consultation",
                  "Diagnosis",
                  "Prescription",
                  "Follow-up care",
                ]).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            {/* Prescription / Advice */}
            <div className="panel advice">
              <h3>Suggested Advice</h3>
              <p>{getAdvice(doctor.speciality)}</p>
            </div>

            {/* availability small */}
            <div className="panel">
              <h3>Availability</h3>
              <div className="slots-vertical">
                {doctor.availability && doctor.availability.length > 0 ? (
                  doctor.availability.map((slot) => (
                    <button key={slot} className="slot-vert" onClick={() => handleSlotClick(slot)}>
                      {formatSlotForList(slot)}
                    </button>
                  ))
                ) : (
                  <p className="muted">No slots available</p>
                )}
              </div>
            </div>
          </aside>

          {/* right column: details, map, reviews */}
          <main className="profile-right">
            {/* contact card */}
            <div className="panel contact-panel">
              <h3>Contact & Location</h3>
              <p><strong>Address:</strong> {doctor.hospital}</p>
              <p><strong>Phone:</strong> {doctor.phone || "Not provided"}</p>

              <div className="map-actions">
                <button className="btn ghost" onClick={() => setShowMap(s => !s)}>
                  {showMap ? "Hide Map" : "Show Map"}
                </button>

                <a
                  className="btn ghost"
                  href={`https://www.google.com/maps/search/${encodeURIComponent(doctor.hospital + " " + (doctor.city || "Bhopal"))}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Google Maps
                </a>
              </div>

              {showMap && (
                <div className="map-frame">
                  <iframe
                    title="hospital-map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(doctor.hospital + " " + (doctor.city || "Bhopal"))}&output=embed`}
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* Detailed sections */}
            <div className="panel">
              <h3>Full Profile</h3>
              <dl className="detail-list">
                <dt>Education</dt>
                <dd>{doctor.education || "MBBS, MD (specialty) — details not provided"}</dd>

                <dt>Languages</dt>
                <dd>{(doctor.languages || ["English", "Hindi"]).join(", ")}</dd>

                <dt>Clinic Timings</dt>
                <dd>{doctor.timings || "Mon - Sat: 09:00 - 17:00"}</dd>

                <dt>Insurance Accepted</dt>
                <dd>{(doctor.insurance || ["Cash", "UPI"]).join(", ")}</dd>
              </dl>
            </div>

            {/* Reviews */}
            <div className="panel">
              <h3>Patient Reviews ({reviews.length})</h3>

              <div className="reviews">
                {reviews.length === 0 && <p className="muted">No reviews yet. Be the first to add one.</p>}
                {reviews.map((r, idx) => (
                  <div key={idx} className="review">
                    <div className="rev-head">
                      <strong>{r.name || "Anonymous"}</strong>
                      <span className="rev-rating">★ {r.rating}</span>
                    </div>
                    <p className="rev-text">{r.text}</p>
                    <div className="rev-meta muted">{new Date(r.date).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Add review */}
              <div className="add-review">
                <h4>Add a review</h4>
                <input placeholder="Your name" value={newReview.name} onChange={(e)=>setNewReview(n=>({...n,name:e.target.value}))} />
                <select value={newReview.rating} onChange={(e)=>setNewReview(n=>({...n,rating: Number(e.target.value)}))}>
                  {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n} stars</option>)}
                </select>
                <textarea placeholder="Write about your experience" value={newReview.text} onChange={(e)=>setNewReview(n=>({...n,text:e.target.value}))} />
                <div style={{display:"flex", gap:8}}>
                  <button className="btn primary" onClick={saveReviewLocally}>Submit Review</button>
                  <button className="btn ghost" onClick={()=>setNewReview({name:"",rating:5,text:""})}>Reset</button>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="panel">
              <h3>FAQ</h3>
              <details>
                <summary>What should I bring to the appointment?</summary>
                <p>Bring previous reports, a list of medicines, and any insurance documents.</p>
              </details>

              <details>
                <summary>Can I consult online?</summary>
                <p>If the doctor is marked as Online, you may request a teleconsult via the clinic's number.</p>
              </details>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// small helper to format slot like "DD Mon • HH:MM"
function formatSlotForList(slot) {
  try {
    const [dateStr, timeStr] = slot.split(" ");
    const d = new Date(`${dateStr}T${timeStr}`);
    const day = d.getDate();
    const mon = d.toLocaleString(undefined, { month: "short" });
    return `${day} ${mon} • ${timeStr}`;
  } catch {
    return slot;
  }
}

export default DoctorProfile;
