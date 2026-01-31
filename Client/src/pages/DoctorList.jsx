import React, { useEffect, useMemo, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import API from "../utils/api";
import "./DoctorList.css";

const PAGE_SIZE = 8;

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [speciality, setSpeciality] = useState("All");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [page, setPage] = useState(1);

  /* ================= FETCH DOCTORS ================= */
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await API.get("/doctors", {
          params: {
            search: query || undefined,
            specialization:
              speciality !== "All" ? speciality : undefined,
          },
        });

        setDoctors(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load doctors", err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [query, speciality]);

  /* ================= SPECIALITIES ================= */
  const specialities = useMemo(() => {
    const set = new Set();
    doctors.forEach((d) => {
      if (d.specialization) set.add(d.specialization);
      if (d.speciality) set.add(d.speciality);
    });
    return ["All", ...Array.from(set)];
  }, [doctors]);

  /* ================= FRONTEND FILTERS ================= */
  const filteredDoctors = useMemo(() => {
    let list = [...doctors];

    if (onlineOnly) {
      list = list.filter((d) => d.online === true);
    }

    return list;
  }, [doctors, onlineOnly]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDoctors.length / PAGE_SIZE)
  );

  const pagedDoctors = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredDoctors.slice(start, start + PAGE_SIZE);
  }, [filteredDoctors, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  /* ================= RENDER ================= */
  return (
    <div className="doctor-list-page">
      <header className="doctor-list-header">
        <h1>Available Doctors</h1>
        <p className="muted">
          Find and book appointments with verified doctors
        </p>
      </header>

      {/* ================= CONTROLS ================= */}
      <div className="controls">
        <input
          className="search-input"
          placeholder="Search by name, speciality or hospital..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="select"
          value={speciality}
          onChange={(e) => {
            setSpeciality(e.target.value);
            setPage(1);
          }}
        >
          {specialities.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label className="online-toggle">
          <input
            type="checkbox"
            checked={onlineOnly}
            onChange={(e) => {
              setOnlineOnly(e.target.checked);
              setPage(1);
            }}
          />
          Online Only
        </label>
      </div>

      {/* ================= LIST ================= */}
      <div className="doctor-full-list">
        {loading ? (
          <div className="no-results">Loading doctors...</div>
        ) : pagedDoctors.length === 0 ? (
          <div className="no-results">No doctors found</div>
        ) : (
          pagedDoctors.map((doctor) => (
            <DoctorCard
              key={doctor._id || doctor.id}
              doctor={doctor}
            />
          ))
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <span className="page-info">
            Page {page} of {totalPages}
          </span>

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default DoctorList;
