import React, { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [bookings, setBookings] = useState([]);

  // ✅ Load bookings from localStorage
  const loadBookings = () => {
    try {
      const data = JSON.parse(localStorage.getItem("bookings")) || [];
      setBookings(data);
    } catch (error) {
      console.log("Error loading bookings:", error);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="dashboard-page">
      <h2>User Dashboard</h2>

      {/* ✅ Summary Cards */}
      <div className="dash-cards">
        <div className="dash-card">
          <h3>Total Bookings</h3>
          <p>{bookings.length}</p>
        </div>

        <div className="dash-card">
          <h3>Upcoming</h3>
          <p>{bookings.length}</p>
        </div>

        <div className="dash-card">
          <h3>Completed</h3>
          <p>0</p>
        </div>
      </div>

      {/* ✅ Booking List */}
      <div className="dash-info">
        <h3>My Appointments</h3>

        {bookings.length === 0 ? (
          <p style={{ color: "gray" }}>No appointments booked yet.</p>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (
                <tr key={index}>
                  <td>{b.doctorName}</td>
                  <td>{b.patientName}</td>
                  <td>{b.phone}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
