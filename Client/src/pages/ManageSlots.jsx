import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./ManageSlots.css"; // optional

export default function ManageSlots() {
  const { id } = useParams(); // doctor id
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // load doctor
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const res = await API.get(`/doctors/${id}`);
        setDoctor(res.data);
      } catch {
        setError("Doctor not found");
      }
    };
    loadDoctor();
  }, [id]);

  const addSlot = async () => {
    if (!date || !slot) return;

    const updatedSlots = [...(doctor.availableSlots || [])];
    const idx = updatedSlots.findIndex((d) => d.date === date);

    if (idx >= 0) {
      if (!updatedSlots[idx].slots.includes(slot)) {
        updatedSlots[idx].slots.push(slot);
      }
    } else {
      updatedSlots.push({ date, slots: [slot] });
    }

    try {
      setSaving(true);
      const res = await API.put(`/doctors/${id}`, {
        availableSlots: updatedSlots,
      });
      setDoctor(res.data);
      setSlot("");
    } catch {
      alert("Failed to add slot");
    } finally {
      setSaving(false);
    }
  };

  const removeSlot = async (d, s) => {
    const updatedSlots = doctor.availableSlots
      .map((day) =>
        day.date === d
          ? { ...day, slots: day.slots.filter((x) => x !== s) }
          : day
      )
      .filter((day) => day.slots.length > 0);

    try {
      const res = await API.put(`/doctors/${id}`, {
        availableSlots: updatedSlots,
      });
      setDoctor(res.data);
    } catch {
      alert("Failed to remove slot");
    }
  };

  if (!doctor) {
    return <div className="page-wrap">Loading...</div>;
  }

  return (
    <div className="page-wrap">
      <h1>Manage Slots — {doctor.name}</h1>

      <div className="form-card">
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <label>
          Time Slot
          <input
            type="time"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
          />
        </label>

        <button className="btn primary" onClick={addSlot} disabled={saving}>
          Add Slot
        </button>
      </div>

      <div className="panel">
        <h3>Existing Slots</h3>

        {doctor.availableSlots?.length === 0 && (
          <p className="muted">No slots added yet</p>
        )}

        {doctor.availableSlots?.map((day) => (
          <div key={day.date} className="slot-day">
            <strong>{day.date}</strong>
            <div className="slots-row">
              {day.slots.map((s) => (
                <span key={s} className="slot-chip">
                  {s}
                  <button
                    className="remove"
                    onClick={() => removeSlot(day.date, s)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="btn ghost" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}
