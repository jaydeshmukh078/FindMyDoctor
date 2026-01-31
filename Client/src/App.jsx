import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import DoctorList from "./pages/DoctorList";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AddDoctor from "./pages/AddDoctor";
import ManageSlots from "./pages/ManageSlots";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sosLoading, setSosLoading] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      localStorage.removeItem("user");
    }
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate("/doctors", { state: { q: query.trim() } });
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSOS = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setSosLoading(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setSosLoading(false);
        window.location.href = "tel:102";
      },
      () => setSosLoading(false)
    );
  };

  return (
    <div className="app-root">
      {/* ================= NAVBAR ================= */}
      <header className="topbar">
        <div className="topbar-inner container">
          <Link to="/" className="brand">FindMyDoctor</Link>

          <form className="nav-search" onSubmit={submitSearch}>
            <input
              type="search"
              placeholder="Search doctors, speciality or hospital..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <nav className={`nav ${mobileOpen ? "open" : ""}`}>
            <Link to="/">Home</Link>
            <Link to="/doctors">Doctors</Link>

            {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}

            {!isLoggedIn ? (
              <Link to="/login">Login</Link>
            ) : (
              <span className="nav-link-btn" onClick={handleLogout}>Logout</span>
            )}

            <button className="nav-btn sos" onClick={handleSOS}>
              {sosLoading ? "..." : "🚨 SOS"}
            </button>

            <button
              className="nav-btn primary"
              onClick={() => navigate("/doctors")}
            >
              Book Appointment
            </button>
          </nav>

          <button
            className="hamburger"
            onClick={() => setMobileOpen((s) => !s)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route path="/book/:id" element={<BookAppointment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/add-doctor" element={<AddDoctor />} />
            <Route path="/admin/doctor/:id/slots" element={<ManageSlots />} />
          </Route>
        </Routes>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="container footer-grid">

          {/* BRAND */}
          <div className="footer-brand">
            <h3>FindMyDoctor</h3>
            <p className="muted">
              Trusted medical search & appointment booking platform.
            </p>
          </div>

          {/* EXPLORE */}
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/doctors">Find Doctors</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/doctors">Book Appointment</Link>
          </div>

          {/* ACCOUNT */}
          <div className="footer-col">
            <h4>Account</h4>
            {!isLoggedIn ? (
              <Link to="/login">Login</Link>
            ) : (
              <>
                <Link to="/dashboard">My Dashboard</Link>
                <span className="footer-logout" onClick={handleLogout}>
                  Logout
                </span>
              </>
            )}
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} FindMyDoctor — All rights reserved
        </div>
      </footer>
    </div>
  );
}

export default App;
