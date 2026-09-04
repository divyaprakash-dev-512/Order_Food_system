import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../admincss/ad.css";

const API_BASE_URL = "https://order-food-system-1.onrender.com";

export default function Dashboard() {
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, userRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/show-food`),
          axios.get(`${API_BASE_URL}/api/show-all-users`),
        ]);

        setFoods(foodRes.data.data || []);
        setUsers(userRes.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const cards = useMemo(() => {
    const availableFoods = foods.filter((item) => item.isAvailable).length;
    const foodCategories = new Set(foods.map((item) => item.category).filter(Boolean))
      .size;
    const averagePrice = foods.length
      ? Math.round(
          foods.reduce((sum, item) => sum + Number(item.price || 0), 0) / foods.length
        )
      : 0;

    return [
      { title: "Total Foods", value: foods.length, note: "Items in your menu", to: "/food-menu" },
      { title: "Available Now", value: availableFoods, note: "Ready to order", to: "/food-menu?status=available" },
      { title: "Categories", value: foodCategories, note: "Active cuisine groups", to: "/food-category" },
      { title: "Registered Users", value: users.length, note: "All customer accounts", to: "/reg-users" },
      { title: "Average Price", value: `Rs. ${averagePrice}`, note: "Across all foods", to: "/food-menu" },
      {
        title: "Latest Item",
        value: foods[0]?.itemName || "None",
        note: "Most recently added food",
        to: "/food-menu?sort=latest",
      },
    ];
  }, [foods, users]);

  const latestFoods = useMemo(() => foods.slice(0, 6), [foods]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Overview</p>
          <h1>Food ordering dashboard</h1>
        </div>
        <p className="admin-page-copy">
          A cleaner admin home with live counts from your current foods and users.
        </p>
      </div>

      <div className="dashboard">
        {cards.map((card) => (
          <Link className="card dashboard-link-card" to={card.to} key={card.title}>
            <h3>{card.title}</h3>
            <h1>{card.value}</h1>
            <p>{card.note}</p>
            <span className="dashboard-card-action">Open list</span>
          </Link>
        ))}
      </div>

      <div className="admin-table-card">
        <div className="admin-table-head">
          <div>
            <p className="admin-kicker">Latest</p>
            <h2>Recently Added Items</h2>
          </div>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-touch-table">
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {latestFoods.length === 0 ? (
                <tr>
                  <td colSpan="4" className="admin-empty-cell">No food item added yet.</td>
                </tr>
              ) : (
                latestFoods.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <Link className="admin-table-food-link" to={`/food-menu/edit/${item._id}`}>
                        {item.itemName}
                      </Link>
                      <span>{item.description || "Fresh food item"}</span>
                    </td>
                    <td>{item.category}</td>
                    <td>Rs. {item.price}</td>
                    <td>
                      <span className={`admin-status-pill ${item.isAvailable ? "ok" : "off"}`}>
                        {item.isAvailable ? "Available" : "Out"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
