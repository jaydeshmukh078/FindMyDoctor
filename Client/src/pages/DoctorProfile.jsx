import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./DoctorProfile.css";

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await API.get(`/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Doctor load failed", err);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return <div className="dp-loading">Loading doctor profile...</div>;
  }

  if (!doctor) {
    return <div className="dp-loading">Doctor not found</div>;
  }

  return (
    <div className="dp-page">
      {/* ================= HEADER CARD ================= */}
      <div className="dp-card">
        {/* LEFT */}
        <div className="dp-left">
          <img
            src={
              doctor.image ||
              doctor.imageUrl ||
              "https://cdn-icons-png.flaticon.com/512/387/387561.png"
            }
            alt={doctor.name}
          />

          {doctor.online === true ? (
            <span className="dp-status online">Online</span>
          ) : (
            <span className="dp-status offline">Offline</span>
          )}
        </div>

        {/* MIDDLE */}
        <div className="dp-middle">
          <h1>{doctor.name}</h1>

          <p className="dp-special">
            {doctor.specialization || doctor.speciality || "Medical Specialist"}
          </p>

          <p className="dp-hospital">
            🏥 {doctor.hospital || doctor.location || "Clinic"}
          </p>

          <div className="dp-tags">
            <span>🕒 {doctor.experience || "—"} yrs experience</span>
            <span>
              💰{" "}
              {doctor.fees
                ? `₹${doctor.fees}`
                : doctor.fee || "Consultation Fee"}
            </span>
          </div>

          <p className="dp-about">
            {doctor.about ||
              "Experienced and trusted medical professional providing quality healthcare services."}
          </p>
        </div>

        {/* RIGHT */}
        <div className="dp-right">
          <div className="dp-rating">
            ⭐ {doctor.ratingAverage || doctor.rating || 4.5}
          </div>

          <button
            className="dp-book"
            onClick={() => navigate(`/book/${doctor._id}`)}
          >
            Book Appointment
          </button>

          <p className="dp-note">
            Instant confirmation · No booking charges
          </p>
        </div>
      </div>

      {/* ================= DETAILS SECTION ================= */}
      <div className="dp-grid">
        {/* CLINIC INFO */}
        <div className="dp-box">
          <h3>Clinic Information</h3>
          <p>
            <strong>Address:</strong>{" "}
            {doctor.clinicAddress || doctor.location || "Not available"}
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            {doctor.contactNumber || "Not available"}
          </p>
          <p>
            <strong>Timings:</strong>{" "}
            {doctor.timings?.start && doctor.timings?.end
              ? `${doctor.timings.start} – ${doctor.timings.end}`
              : "Not specified"}
          </p>
        </div>

        {/* SPECIALITIES */}
        <div className="dp-box">
          <h3>Specialities</h3>
          <ul>
            <li>
              {doctor.specialization ||
                doctor.speciality ||
                "General Medicine"}
            </li>
          </ul>
        </div>

        {/* TRUST */}
        <div className="dp-box">
          <h3>Why Choose This Doctor?</h3>
          <ul>
            <li>✔ Verified medical professional</li>
            <li>✔ Trusted by patients</li>
            <li>✔ Modern clinic facilities</li>
            <li>✔ Secure appointment booking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
