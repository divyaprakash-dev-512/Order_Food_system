import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../admincss/fd.css";
import { CATEGORY_OPTIONS, CATEGORY_NAME_MAP } from "../data/categories";

const API_BASE_URL = "https://order-food-backend-nfua.onrender.com";

export default function FoodCategory() {
  const [foodList, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const categorySummary = useMemo(() => {
    const counts = foodList.reduce((acc, item) => {
      const key = item.category;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return CATEGORY_OPTIONS.map((category) => ({
      id: category.id,
      name: category.name,
      totalItems: counts[category.id] || 0,
      status: counts[category.id] > 0 ? "Active" : "Empty",
    }))
      .filter((category) => category.totalItems > 0)
      .filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [foodList, searchTerm]);

  const uncategorizedItems = useMemo(() => {
    return foodList.filter((item) => !CATEGORY_NAME_MAP[item.category]);
  }, [foodList]);

  const handleDeleteCategory = async (category) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/category/${category.id}`);
      fetchFoodData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="foodcat-main-wrapper">
      <h1 className="foodcat-heading">Manage Food Categories</h1>

      <div className="foodcat-card">
        <h2 className="foodcat-subtitle">Category overview</h2>
        <p className="foodcat-helper-text">
          Edit will rename the category across all foods. Delete will remove all
          foods inside that category.
        </p>
      </div>

      <div className="foodcat-toolbar">
        <input
          type="text"
          placeholder="Search category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="foodcat-search"
        />
      </div>

      <div className="foodcat-list-container">
        <table className="foodcat-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Category Name</th>
              <th>Total Foods</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categorySummary.length > 0 ? (
              categorySummary.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="cat-name">{item.name}</td>
                  <td>{item.totalItems}</td>
                  <td style={{ textAlign: "center" }}>
                    <span className="status-badge">{item.status}</span>
                  </td>
                  <td className="foodcat-actions-cell">
                    <Link
                      to={`/food-category/edit/${item.id}`}
                      className="foodcat-action-btn foodcat-link-btn"
                    >
                      Edit
                    </Link>
                    <button
                      className="foodcat-action-btn delete"
                      onClick={() => handleDeleteCategory(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>
                  No categories found yet. Add a food item first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
