import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import { CATEGORY_NAME_MAP } from "../data/categories";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Navbar ke dropdown ke liye categories fetch karna
    axios.get("http://localhost:5533/api/show-food")
      .then(res => {
        const list = res.data.data || [];
        const uniqueCats = [...new Set(list.map(i => i.category).filter(Boolean))];
        setCategories(uniqueCats);
      })
      .catch(err => console.log("Navbar fetch error:", err));
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <p>Free delivery on orders above Rs. 199</p>
        <div className="auth-btns">
          {user ? (
            <Link to="/account" className="login-btn">My Account</Link>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="custom-navbar">
        <h2 className="custom-logo">Foodie</h2>
        <div className="custom-nav-links">
          <Link to="/">Home</Link>
          <div className="custom-menu-dropdown">
            <button className="custom-menu-title">Explore Menu</button>
            <div className="custom-menu-items">
              {categories.map(cat => (
                <Link key={cat} to={`/food-menu/category/${cat}`}>
                  {CATEGORY_NAME_MAP[cat] || cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Link to="/myCart" className="custom-cart-btn">Cart</Link>
      </div>

      {/* Ye Outlet hi aapke Home aur baaki pages ko niche render karega */}
      <main>
        <Outlet />
      </main>
    </>
  );
}
