import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DoctorCard.css";

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  // 🔑 Doctor ID (backend / frontend safe)
  const id = doctor._id || doctor.id;

  /* ===============================
     🔥 SLOT NORMALIZER (VERY IMPORTANT)
     Backend:
       availableSlots: [
         { date: "YYYY-MM-DD", slots: ["10:00 AM", "10:30 AM"] }
       ]
     Frontend dummy:
       availability: ["YYYY-MM-DD HH:MM"]
  =============================== */
  const slots = Array.isArray(doctor.availability)
    ? doctor.availability
    : Array.isArray(doctor.availableSlots)
    ? doctor.availableSlots.flatMap((d) =>
        (d.slots || []).map((t) => `${d.date} ${t}`)
      )
    : [];

  // slot formatter
  const formatSlot = (slot) => {
    try {
      const [dateStr, timeStr] = slot.split(" ");
      const d = new Date(`${dateStr}T${timeStr}`);
      const day = d.getDate();
      const month = d.toLocaleString(undefined, { month: "short" });
      return `${day} ${month} • ${timeStr}`;
    } catch {
      return slot;
    }
  };

  // slot click
  const handleSlotClick = (slot) => {
    const [date, time] = slot.split(" ");
    navigate(`/book/${id}`, {
      state: { doctor, prefill: { date, time } },
    });
  };

  return (
    <article className="doctor-row-card final">
      {/* IMAGE + STATUS */}
      <div className="doctor-row-image">
        <img
          src={
            doctor.image ||
            doctor.imageUrl ||
            "https://via.placeholder.com/150"
          }
          alt={doctor.name}
        />

        {doctor.online === true ? (
          <span className="online-badge">Online</span>
        ) : (
          <span className="offline-badge">Offline</span>
        )}
      </div>

      {/* INFO */}
      <div className="doctor-row-info">
        <div className="top-row">
          <h3>{doctor.name}</h3>
          <div className="rating">
            ★ {doctor.rating || doctor.ratingAverage || 4.5}
          </div>
        </div>

        <p className="speciality">
          {doctor.speciality || doctor.specialization || "Specialist"}
        </p>

        <p className="hospital">
          {doctor.hospital || doctor.location || "Clinic"}
        </p>

        <div className="meta">
          <span>🕒 {doctor.experience || "—"} </span>
          <span>•</span>
          <span>
            💰{" "}
            {doctor.fee
              ? doctor.fee
              : doctor.fees
              ? `₹${doctor.fees}`
              : "—"}
          </span>
        </div>

        <p className="about">
          {doctor.about || "Experienced medical professional."}
        </p>

        {/* SLOTS */}
        <div className="availability">
          <strong>Available slots</strong>
          <div className="slots">
            {slots.length > 0 ? (
              slots.slice(0, 6).map((s) => (
                <button
                  key={s}
                  className="slot-chip"
                  onClick={() => handleSlotClick(s)}
                >
                  {formatSlot(s)}
                </button>
              ))
            ) : (
              <span className="no-slots">No slots available</span>
            )}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="doctor-row-actions">
        <Link
          to={`/doctors/${id}`}
          state={{ doctor }}
          className="btn ghost"
        >
          View Profile
        </Link>

        <Link
          to={`/book/${id}`}
          state={{ doctor }}
          className="btn primary"
        >
          Book Now
        </Link>
      </div>
    </article>
  );
}

export default DoctorCard;
