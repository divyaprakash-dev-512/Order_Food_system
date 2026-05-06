import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../admincss/ad.css";

const API_BASE_URL = "http://localhost:5533";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, formData);

      if (res.data.user?.role !== "admin") {
        alert("Only admin can login here");
        return;
      }

      localStorage.setItem("adminUser", JSON.stringify(res.data.user));
      navigate("/admin");
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        alert("Backend server start nahi hai. Pehle backend me node server.js chalao.");
      } else {
        alert(error.response?.data?.message || "Admin login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-mark">A</div>
        <p className="admin-kicker">Admin Access</p>
        <h1>Login to Dashboard</h1>
        <p className="admin-login-copy">Manage foods, orders, users and categories from one place.</p>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </section>
  );
}
