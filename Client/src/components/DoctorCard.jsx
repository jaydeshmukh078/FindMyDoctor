import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DoctorCard.css";

/**
 * DoctorCard (final)
 * - Expects doctor object with: id, name, speciality, hospital, experience, fee, rating, image, availability[], online
 * - Clicking a slot navigates to /book/:id with state { doctor, prefill: { date, time } }
 * - Book Now passes doctor in state
 */

function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const id = doctor.id || doctor._id || "unknown";

  // format slot "YYYY-MM-DD HH:MM" -> "DD Mon • HH:MM"
  function formatSlot(slot) {
    try {
      const [dateStr, timeStr] = slot.split(" ");
      const d = new Date(`${dateStr}T${timeStr}`);
      const day = d.getDate();
      const month = d.toLocaleString(undefined, { month: "short" });
      const time = timeStr;
      return `${day} ${month} • ${time}`;
    } catch {
      return slot;
    }
  }

  function handleSlotClick(slot) {
    const [d, t] = slot.split(" ");
    navigate(`/book/${id}`, {
      state: { doctor, prefill: { date: d, time: t } },
    });
  }

  return (
    <article className="doctor-row-card final">
      <div className="doctor-row-image">
        <img src={doctor.image} alt={doctor.name} loading="lazy" />
        {doctor.online ? <span className="online-badge">Online</span> : <span className="offline-badge">Offline</span>}
      </div>

      <div className="doctor-row-info">
        <div className="top-row">
          <h3>{doctor.name}</h3>
          <div className="rating" title={`Rating ${doctor.rating || 4.5}`}>★ {doctor.rating || 4.5}</div>
        </div>

        <p className="speciality">{doctor.speciality}</p>
        <p className="hospital">{doctor.hospital}</p>

        <div className="meta">
          <span className="meta-item">🕒 {doctor.experience}</span>
          <span className="meta-sep">•</span>
          <span className="meta-item">💰 {doctor.fee}</span>
        </div>

        <p className="about">{doctor.about}</p>

        <div className="availability">
          <strong>Available slots</strong>
          <div className="slots">
            {doctor.availability && doctor.availability.length > 0 ? (
              doctor.availability.slice(0, 6).map((s) => (
                <button
                  key={s}
                  className="slot-chip"
                  onClick={() => handleSlotClick(s)}
                  title={`Book ${formatSlot(s)}`}
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

      <div className="doctor-row-actions">
        <Link to={`/doctors/${id}`} state={{ doctor }} className="btn ghost">View Profile</Link>

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
