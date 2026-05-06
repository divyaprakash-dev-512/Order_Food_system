import React from "react";
import "../admincss/ad.css";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/create-food", label: "Create Food" },
  { to: "/food-category", label: "Categories" },
  { to: "/food-menu", label: "Food List" },
  { to: "/orders", label: "Orders" },
  { to: "/reg-users", label: "Users" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("adminUser"));

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  return (
    <aside className="admin-sidebar-shell">
      <div className="profile">
        <div className="avatar">{adminUser?.name?.charAt(0) || "A"}</div>
        <p>Admin Panel</p>
        <span>{adminUser?.email || "Manage foods, categories and users"}</span>
      </div>

      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "admin-nav-link active" : "admin-nav-link"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button className="admin-logout-btn" type="button" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}
