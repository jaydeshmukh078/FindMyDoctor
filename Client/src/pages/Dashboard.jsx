import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load user appointments
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const res = await API.get("/appointments/mine");
        setAppointments(res.data || []);
      } catch (err) {
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      await API.delete(`/appointments/cancel/${id}`);
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: "cancelled" } : a
        )
      );
    } catch {
      alert("Unable to cancel appointment");
    }
  };

  const total = appointments.length;
  const upcoming = appointments.filter((a) => a.status === "booked").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  return (
    <div className="dashboard-wrap">
      <h1>My Appointments</h1>

      {/* ===== Stats ===== */}
      <div className="stats-row">
        <div className="stat-card">
          <h4>Total</h4>
          <strong>{total}</strong>
        </div>

        <div className="stat-card">
          <h4>Upcoming</h4>
          <strong>{upcoming}</strong>
        </div>

        <div className="stat-card">
          <h4>Cancelled</h4>
          <strong>{cancelled}</strong>
        </div>
      </div>

      {/* ===== List ===== */}
      <div className="appointments-card">
        <h2>Appointments</h2>

        {loading && <p className="muted">Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && appointments.length === 0 && (
          <div className="empty-state">
            No appointments booked yet.
          </div>
        )}

        {appointments.map((a) => (
          <div key={a._id} className="appointment-row">
            <div className="doctor-name">
              {a.doctor?.name || "Doctor"}
              <div className="meta">
                {a.doctor?.specialization} • {a.doctor?.location}
              </div>
            </div>

            <div className="meta">{a.date}</div>
            <div className="meta">{a.timeSlot}</div>

            <div className={`status ${a.status}`}>
              {a.status}
            </div>

            <div className="appointment-actions">
              {a.status === "booked" && (
                <button
                  className="btn ghost"
                  onClick={() => cancelAppointment(a._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
