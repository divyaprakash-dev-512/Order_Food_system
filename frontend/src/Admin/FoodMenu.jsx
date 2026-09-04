import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import "../admincss/foodmenu.css";
import { CATEGORY_NAME_MAP } from "../data/categories";

const API_BASE_URL = "https://order-food-system-1.onrender.com";

const FoodMenu = () => {
  const [searchParams] = useSearchParams();
  const [foodList, setFoodList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const statusFilter = searchParams.get("status") || "all";
  const sortFilter = searchParams.get("sort") || "default";

  const fetchFoodData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/show-food`);
      setFoodList(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFoodData();
  }, []);

  const categories = useMemo(() => {
    return ["all", ...new Set(foodList.map((item) => item.category).filter(Boolean))];
  }, [foodList]);

  const filteredFoods = useMemo(() => {
    const list = foodList
      .filter((item) =>
        selectedCategory === "all" ? true : item.category === selectedCategory
      )
      .filter((item) =>
        statusFilter === "available" ? item.isAvailable : true
      )
      .filter((item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortFilter === "latest") {
      return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [foodList, selectedCategory, searchTerm, statusFilter, sortFilter]);

  const handleDeleteFood = async (itemId) => {
    if (window.confirm("Delete this item?")) {
      await axios.delete(`${API_BASE_URL}/api/food/${itemId}`);
      fetchFoodData();
    }
  };

  // 📊 Availability %
  const availabilityRate = useMemo(() => {
    if (foodList.length === 0) return 0;
    return Math.round(
      (foodList.filter((f) => f.isAvailable).length / foodList.length) * 100
    );
  }, [foodList]);

  return (
    <div className="fm-page-wrapper">

      {/* ⚠️ ALERT */}
      {availabilityRate < 50 && (
        <div className="alert-box">
          ⚠️ Low stock! Only {availabilityRate}% items available
        </div>
      )}

      {/* 🔥 STATS */}
      <div className="fm-stats">
        <div className="stat-card">
          <h4>Total Items</h4>
          <p>{foodList.length}</p>
        </div>

        <div className="stat-card green">
          <h4>Available</h4>
          <p>{foodList.filter(f => f.isAvailable).length}</p>
        </div>

        <div className="stat-card red">
          <h4>Out of Stock</h4>
          <p>{foodList.filter(f => !f.isAvailable).length}</p>
        </div>
      </div>

      {/* HEADER */}
      <header className="fm-main-header">
        <div>
          <h1 className="fm-title-large">Kitchen Master</h1>
          <p className="fm-subtitle">
            {statusFilter === "available"
              ? "Showing available foods"
              : sortFilter === "latest"
                ? "Showing latest foods"
                : "Live Menu Dashboard"}
          </p>
        </div>

        <div className="fm-stock-meter">
          <div className="meter-info">
            <span>Availability</span>
            <span>{availabilityRate}%</span>
          </div>
          <div className="meter-bar">
            <div
              className="meter-fill"
              style={{ width: `${availabilityRate}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* SEARCH */}
      <div className="fm-search-box">
        <input
          type="text"
          placeholder="Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {(statusFilter !== "all" || sortFilter !== "default") && (
        <div className="fm-active-filter">
          <span>
            {statusFilter === "available" ? "Available items" : "Latest items"}
          </span>
          <Link to="/food-menu">Clear filter</Link>
        </div>
      )}

      {/* FILTER */}
      <div className="fm-filter-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`fm-tab-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "all" ? "All Items" : CATEGORY_NAME_MAP[cat] || cat}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="fm-data-container">
        <table className="fm-custom-table">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredFoods.map((item) => (
              <tr key={item._id} className="fm-table-row">
                <td>
                  <strong>{item.itemName}</strong>
                  <p>{item.description || "Fresh dish"}</p>
                </td>

                <td>
                  <span className="fm-cat-label">
                    {CATEGORY_NAME_MAP[item.category] || item.category}
                  </span>
                </td>

                <td className="fm-price">₹{item.price}</td>

                <td>
                  <div
                    className={`fm-status-dot ${
                      item.isAvailable ? "online" : "offline"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Out"}
                  </div>
                </td>

                <td>
                  <div className="fm-btn-group">
                    <Link
                      to={`/food-menu/edit/${item._id}`}
                      className="btn-icon edit"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDeleteFood(item._id)}
                      className="btn-icon delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodMenu;
