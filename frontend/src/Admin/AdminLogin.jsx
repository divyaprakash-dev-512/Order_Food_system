import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../admincss/ad.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Hardcoded Credentials
  const FIXED_EMAIL = "admin@123gmail.com";
  const FIXED_PASSWORD = "aryan";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Fixed credentials check
    if (formData.email === FIXED_EMAIL && formData.password === FIXED_PASSWORD) {
      const dummyAdminUser = {
        email: FIXED_EMAIL,
        role: "admin",
        name: "Admin Aryan",
      };

      localStorage.setItem("adminUser", JSON.stringify(dummyAdminUser));
      setLoading(false);
      navigate("/admin");
    } else {
      setLoading(false);
      alert("Invalid Email or Password!");
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
            placeholder="admin@123gmail.com"
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