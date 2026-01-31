import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import API from "../utils/api";
import "./BookAppointment.css";

export default function BookAppointment() {
  const { id } = useParams(); // doctorId
  const location = useLocation();
  const navigate = useNavigate();

  const prefill = location.state?.prefill || null;
  const passedDoctor = location.state?.doctor || null;

  const [doctor, setDoctor] = useState(passedDoctor);
  const [loading, setLoading] = useState(!passedDoctor);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    date: prefill?.date || "",
    timeSlot: prefill?.time || "",
    notes: "",
  });

  // 🔹 Load doctor if not passed
  useEffect(() => {
    if (doctor) return;

    const loadDoctor = async () => {
      try {
        const res = await API.get(`/doctors/${id}`);
        setDoctor(res.data);
      } catch {
        setError("Doctor not found");
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id, doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.date || !form.timeSlot) {
      setError("Please select date and time");
      return;
    }

    setSaving(true);
    try {
      await API.post("/appointments/book", {
        doctorId: doctor._id,
        date: form.date,
        timeSlot: form.timeSlot,
        notes: form.notes,
      });

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="book-page">
        <h3>Loading doctor...</h3>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="book-page">
        <h3>Doctor not found</h3>
      </div>
    );
  }

  // ✅ SUCCESS SCREEN
  if (success) {
    return (
      <div className="book-page">
        <div className="confirmation">
          <h2>✅ Appointment Confirmed</h2>
          <p><strong>Doctor:</strong> {doctor.name}</p>
          <p><strong>Date:</strong> {form.date}</p>
          <p><strong>Time:</strong> {form.timeSlot}</p>

          <div className="confirmation-actions">
            <button
              className="btn primary"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>

            <button
              className="btn ghost"
              onClick={() => navigate("/doctors")}
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-page">
      <h2>Book Appointment</h2>

      {/* Doctor summary */}
      <div className="doctor-summary">
        <div className="doc-left">
          <img
            src={doctor.imageUrl || doctor.image || "https://cdn-icons-png.flaticon.com/512/387/387561.png"}
            alt={doctor.name}
          />
        </div>

        <div className="doc-right">
          <h3>{doctor.name}</h3>
          <p className="muted">
            {doctor.specialization} • {doctor.location}
          </p>

          <div className="doc-meta">
            <span>🕒 {doctor.experience} yrs</span>
            <span>•</span>
            <span>💵 ₹{doctor.fees}</span>
            <span>•</span>
            <span>⭐ {doctor.ratingAverage || "4.5"}</span>
          </div>
        </div>
      </div>

      {/* Booking form */}
      <form className="book-form" onSubmit={handleSubmit}>
        <label>
          Date
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Time Slot
          <input
            type="time"
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Notes (optional)
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any concern or message"
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <button
            type="submit"
            className="confirm-btn"
            disabled={saving}
          >
            {saving ? "Booking..." : "Confirm Appointment"}
          </button>

          <button
            type="button"
            className="btn ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
