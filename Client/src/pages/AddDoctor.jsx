import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./AddDoctor.css"; // optional, agar nahi hai to bhi UI break nahi hoga

export default function AddDoctor() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    location: "",
    fees: "",
    experience: "",
    about: "",
    imageUrl: "",
    contactNumber: "",
    clinicAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.specialization || !form.location || !form.fees) {
      setError("Please fill required fields");
      return;
    }

    setSaving(true);
    try {
      await API.post("/doctors", {
        ...form,
        fees: Number(form.fees),
        experience: Number(form.experience || 1),
      });
      navigate("/doctors");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add doctor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrap">
      <h1>Add Doctor</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}

        <label>
          Name*
          <input name="name" value={form.name} onChange={handleChange} />
        </label>

        <label>
          Specialization*
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
          />
        </label>

        <label>
          Location*
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </label>

        <label>
          Fees*
          <input
            type="number"
            name="fees"
            value={form.fees}
            onChange={handleChange}
          />
        </label>

        <label>
          Experience (years)
          <input
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
          />
        </label>

        <label>
          About
          <textarea name="about" value={form.about} onChange={handleChange} />
        </label>

        <label>
          Image URL
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </label>

        <label>
          Contact Number
          <input
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
          />
        </label>

        <label>
          Clinic Address
          <input
            name="clinicAddress"
            value={form.clinicAddress}
            onChange={handleChange}
          />
        </label>

        <div className="form-actions">
          <button className="btn primary" disabled={saving}>
            {saving ? "Saving..." : "Add Doctor"}
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
