import React, { useEffect, useMemo, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import doctorsData from "../data/doctors";
import "./DoctorList.css";

/**
 * Full-width doctor listing with:
 * - search by name
 * - filter by speciality
 * - toggle: online only
 * - simple pagination
 */

const PAGE_SIZE = 8;

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [speciality, setSpeciality] = useState("All");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // load from local dummy data
    setDoctors(doctorsData);
  }, []);

  // derive list of specialities
  const specialities = useMemo(() => {
    const s = new Set(doctors.map((d) => d.speciality));
    return ["All", ...Array.from(s)];
  }, [doctors]);

  // filtered results
  const filtered = useMemo(() => {
    let list = doctors;

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          (d.name || "").toLowerCase().includes(q) ||
          (d.hospital || "").toLowerCase().includes(q) ||
          (d.speciality || "").toLowerCase().includes(q)
      );
    }

    if (speciality !== "All") {
      list = list.filter((d) => d.speciality === speciality);
    }

    if (onlineOnly) {
      list = list.filter((d) => d.online);
    }

    return list;
  }, [doctors, query, speciality, onlineOnly]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // handle page change
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div className="doctor-list-page">
      <h1>Available Doctors</h1>

      <div className="controls">
        <div className="search-wrap">
          <input
            placeholder="Search name, speciality or hospital..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={speciality}
            onChange={(e) => {
              setSpeciality(e.target.value);
              setPage(1);
            }}
            className="select"
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
      </div>

      <div className="doctor-full-list">
        {paged.length === 0 ? (
          <div className="no-results">No doctors found.</div>
        ) : (
          paged.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)
        )}
      </div>

      {/* pagination */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <div className="page-info">
          Page {page} of {totalPages}
        </div>

        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DoctorList;
