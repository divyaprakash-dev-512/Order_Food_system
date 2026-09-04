import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../admincss/foodForm.css";

const API_BASE_URL = "https://order-food-system-1.onrender.com";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${id}`);
        const user = res.data.data;
        setForm({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "user",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_BASE_URL}/api/users/${id}/role`, form);
      setMessage("User updated successfully.");
      setTimeout(() => navigate("/reg-users"), 800);
    } catch (error) {
      console.log(error);
      setMessage("Unable to update user.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-heading-block">
        <p className="form-kicker">Admin form</p>
        <h2>Edit User</h2>
        <p className="form-helper">Change user details and role from this page.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        {message ? <p className="form-message">{message}</p> : null}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
