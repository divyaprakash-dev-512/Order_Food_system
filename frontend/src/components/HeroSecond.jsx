import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styling/home.css";

const API_BASE_URL = "https://order-food-backend-nfua.onrender.com";

const buildImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80";
  }

  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
    return imagePath;
  }

  return `${API_BASE_URL}${imagePath}`;
};

export default function HeroSecond() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/show-food`);
        setFoods(res.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFoods();
  }, []);

  const offerFoods = useMemo(() => {
    return foods
      .filter((item) => item.offerText || item.isTrending || item.isNewItem)
      .slice(0, 3);
  }, [foods]);

  if (offerFoods.length === 0) {
    return null;
  }

  return (
    <section className="offers-section">
      <div className="category-header offers-header">
        <p className="category-kicker">Offers & banners</p>
        <h2>Fresh deals picked from admin</h2>
        <p className="category-copy">
          Add offer text, trending, or new flags in admin and those items can
          appear here as homepage banners.
        </p>
      </div>

      <div className="offers-grid">
        {offerFoods.map((item) => (
          <article className="offer-banner-card" key={item._id}>
            <img
              src={buildImageUrl(item.images?.[0])}
              alt={item.itemName}
              className="offer-banner-image"
            />
            <div className="offer-banner-overlay" />
            <div className="offer-banner-content">
              <span className="offer-banner-pill">{item.offerText || "Special pick"}</span>
              <h3>{item.itemName}</h3>
              <p>{item.description || "Freshly made and available now."}</p>
              <Link to={`/food-menu/category/${item.category}`} className="offer-banner-link">
                View products
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
