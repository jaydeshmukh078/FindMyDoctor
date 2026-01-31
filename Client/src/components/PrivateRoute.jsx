import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");

  // not logged in → login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // logged in → allow route
  return <Outlet />;
}
