import React from "react";
import { Link } from "react-router-dom";
import { CATEGORY_OPTIONS } from "../data/categories";
import "../styling/home.css";

export default function Category() {
  return (
    <section className="category-section">
      <div className="category-header">
        <p className="category-kicker">Browse by category</p>
        <h2>Choose what you want to eat today</h2>
        <p className="category-copy">
          Open any category card to see only the foods from that category.
        </p>
      </div>

      <div className="category-grid">
        {CATEGORY_OPTIONS.map((category) => (
          <Link
            key={category.id}
            to={`/food-menu/category/${category.id}`}
            className="category-card"
          >
            <img
              src={category.image}
              alt={category.name}
              className="category-card-image"
            />
            <div className="category-card-overlay" />
            <div className="category-card-content">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span>Open category</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
