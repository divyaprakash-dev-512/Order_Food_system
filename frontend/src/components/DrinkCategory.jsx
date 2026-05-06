import React from "react";
import { Link } from "react-router-dom";
import "../styling/home.css";

const DRINK_OPTIONS = [
  {
    id: "fresh-juice",
    name: "Fresh Juices",
    description: "Orange, mango, watermelon and more refreshing fruit blends.",
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "smoothies",
    name: "Smoothies",
    description: "Creamy banana, berry and mango smoothies for a cool sip.",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "milkshakes",
    name: "Milkshakes",
    description: "Chocolate, vanilla and thick cafe-style shakes you will love.",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    description: "Iced coffee, frappe and chilled mocha picks for coffee lovers.",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function DrinkCategory() {
  return (
    <section className="drink-section">
      <div className="category-header">
        <p className="category-kicker">Liquid delights</p>
        <h2>Juices, smoothies and chilled drinks</h2>
        <p className="category-copy">
          Browse refreshing liquid options just below the food categories.
        </p>
      </div>

      <div className="category-grid">
        {DRINK_OPTIONS.map((drink) => (
          <Link
            key={drink.id}
            to="/food-menu/category/beverages"
            className="category-card drink-card"
          >
            <img
              src={drink.image}
              alt={drink.name}
              className="category-card-image"
            />
            <div className="category-card-overlay drink-card-overlay" />
            <div className="category-card-content">
              <h3>{drink.name}</h3>
              <p>{drink.description}</p>
              <span>Explore drinks</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
