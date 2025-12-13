// src/pages/BookAppointment.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import API from "../utils/api";
import doctorsLocal from "../data/doctors";
import "./BookAppointment.css";

function BookAppointment() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const navDoctor = location.state?.doctor || null;
  const prefill = location.state?.prefill || null;

  const [doctor, setDoctor] = useState(navDoctor);
  const [loadingDoctor, setLoadingDoctor] = useState(!navDoctor);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: prefill?.date || "",
    time: prefill?.time || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const loadDoctor = async () => {
      if (doctor) {
        setLoadingDoctor(false);
        return;
      }
      if (!id) {
        setLoadingDoctor(false);
        return;
      }
      try {
        const res = await API.get(`/doctors/${id}`);
        if (res && res.data) {
          setDoctor(res.data);
        } else {
          const found = doctorsLocal.find((d) => String(d.id) === String(id) || String(d._id) === String(id));
          setDoctor(found || null);
        }
      } catch (err) {
        // fallback to local
        const found = doctorsLocal.find((d) => String(d.id) === String(id) || String(d._id) === String(id));
        setDoctor(found || null);
      } finally {
        setLoadingDoctor(false);
      }
    };
    loadDoctor();
  }, [id, doctor]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function validatePhone(ph) {
    const cleaned = (ph || "").replace(/\D/g, "");
    return cleaned.length >= 7 && cleaned.length <= 15;
  }

  function saveBookingLocal(obj) {
    const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
    existing.unshift(obj);
    localStorage.setItem("bookings", JSON.stringify(existing));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!validatePhone(form.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!form.date) {
      setError("Please select a date.");
      return;
    }
    if (!form.time) {
      setError("Please select a time.");
      return;
    }

    setSaving(true);

    const payload = {
      doctorId: doctor ? (doctor.id || doctor._id) : id || null,
      doctorName: doctor ? doctor.name : `Doctor (${id || "unknown"})`,
      doctorHospital: doctor ? doctor.hospital : "",
      patientName: form.name.trim(),
      phone: form.phone.trim(),
      date: form.date,
      time: form.time,
      source: "frontend",
    };

    try {
      const res = await API.post("/bookings", payload);
      const created = (res && res.data) ? res.data : { id: Date.now().toString(), ...payload, createdAt: new Date().toISOString() };
      saveBookingLocal(created);
      setConfirmedBooking(created);
    } catch (err) {
      console.error("Booking POST failed, saving locally", err);
      const fallback = { id: Date.now().toString(), ...payload, createdAt: new Date().toISOString() };
      saveBookingLocal(fallback);
      setConfirmedBooking(fallback);
    } finally {
      setSaving(false);
    }
  }

  if (loadingDoctor) return <div className="book-page"><h3>Loading doctor...</h3></div>;

  return (
    <div className="book-page">
      {!confirmedBooking ? (
        <>
          <h2>Book Appointment</h2>

          <div className="doctor-summary">
            <div className="doc-left">
              <img src={doctor?.image || "https://cdn-icons-png.flaticon.com/512/387/387561.png"} alt={doctor?.name || "Doctor"} />
            </div>

            <div className="doc-right">
              <h3>{doctor?.name || "Unknown Doctor"}</h3>
              <p className="muted">{doctor?.speciality || ""} • {doctor?.hospital || ""}</p>
              <div className="doc-meta">
                <span>🕒 {doctor?.experience || "N/A"}</span>
                <span>•</span>
                <span>💵 {doctor?.fee || "—"}</span>
                <span>•</span>
                <span>⭐ {doctor?.rating || "4.5"}</span>
              </div>
            </div>
          </div>

          <form className="book-form" onSubmit={handleSubmit}>
            <label>
              Your Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} required placeholder="9876543210" />
            </label>

            <div className="row">
              <label>
                Date
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
              </label>

              <label>
                Time
                <input type="time" name="time" value={form.time} onChange={handleChange} required />
              </label>
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="form-actions">
              <button type="submit" className="confirm-btn" disabled={saving}>
                {saving ? "Saving..." : "Confirm & Save"}
              </button>

              <Link to={`/doctors/${doctor?.id || id}`} state={{ doctor }} className="btn ghost">
                View Doctor
              </Link>
            </div>
          </form>
        </>
      ) : (
        <div className="confirmation">
          <h2>✅ Appointment Confirmed</h2>
          <p><strong>Doctor:</strong> {confirmedBooking.doctorName}</p>
          <p><strong>Name:</strong> {confirmedBooking.patientName}</p>
          <p><strong>Date:</strong> {confirmedBooking.date}</p>
          <p><strong>Time:</strong> {confirmedBooking.time}</p>

          <div className="confirmation-actions">
            <button className="btn primary" onClick={() => {
              // download ICS (simple)
              const ics = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "CALSCALE:GREGORIAN",
                "BEGIN:VEVENT",
                `UID:${confirmedBooking.id}`,
                `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,"").split(".")[0]}Z`,
                `DTSTART:${confirmedBooking.date.replace(/-/g,"")}T${confirmedBooking.time.replace(":","")}00`,
                `DTEND:${confirmedBooking.date.replace(/-/g,"")}T${confirmedBooking.time.replace(":","")}00`,
                `SUMMARY:Appointment with ${confirmedBooking.doctorName}`,
                `DESCRIPTION:Patient: ${confirmedBooking.patientName} \\nPhone: ${confirmedBooking.phone}`,
                `LOCATION:${confirmedBooking.doctorHospital}`,
                "END:VEVENT",
                "END:VCALENDAR"
              ].join("\r\n");
              const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `appointment-${confirmedBooking.id}.ics`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}>
              Add to Calendar
            </button>

            <Link to="/dashboard" className="btn ghost">Go to Dashboard</Link>

            <button className="btn" onClick={() => navigate("/doctors")}>Find More Doctors</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;