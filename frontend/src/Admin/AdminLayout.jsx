import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import "../admincss/ad.css";

export default function AdminLayout() {
  const adminUser = JSON.parse(localStorage.getItem("adminUser"));

  if (adminUser?.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminDashboard />
      <main className="admin-content-shell">
        <Outlet />
      </main>
    </div>
  );
}
