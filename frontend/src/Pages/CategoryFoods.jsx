import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { CATEGORY_NAME_MAP } from "../data/categories";
import { addToCart } from "../utils/cart";
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

export default function CategoryFoods() {
  const { category } = useParams();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [error, setError] = useState("");



const toggleFavorite = async (foodId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    if (!userId) {
      alert("Please login first");
      return;
    }

    const isFavorite = favorites[foodId];

    if (isFavorite) {
      await axios.delete(
        `${API_BASE_URL}/api/favorites/${userId}/${foodId}`
      );

      setFavorites((prev) => ({
        ...prev,
        [foodId]: false,
      }));
    } else {
      await axios.post(`${API_BASE_URL}/api/favorites`, {
        userId: userId,
        foodId: foodId,
      });

      setFavorites((prev) => ({
        ...prev,
        [foodId]: true,
      }));
    }
  } catch (error) {
    console.log("FAVORITE ERROR:", error.response?.data || error);
    alert("Something went wrong");
  }
};

  const title = useMemo(
    () => CATEGORY_NAME_MAP[category] || category,
    [category]
  );

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`${API_BASE_URL}/api/category/${category}`);
        setFoods(res.data.data || []);
      } catch (err) {
        console.log(err);
        setError("Unable to load this category right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [category]);

  return (
    <section className="category-results-page">
      <div className="category-results-hero">
        <Link to="/" className="category-back-link">
          Back to home
        </Link>
        <p className="category-kicker">Food category</p>
        <h1>{title}</h1>
        <p>
          {loading
            ? "Loading foods..."
            : `${foods.length} item${foods.length === 1 ? "" : "s"} available in this category.`}
        </p>
      </div>

      {error ? <p className="category-empty-state">{error}</p> : null}

      {!loading && !error && foods.length === 0 ? (
        <p className="category-empty-state">
          No food items have been added in this category yet.
        </p>
      ) : null}

      <div className="category-food-grid">
        {foods.map((item) => (
         <article className="category-food-card" key={item._id}>

  <div className="category-food-image-wrapper">

    <img
      src={buildImageUrl(item.images?.[0])}
      alt={item.itemName}
      className="category-food-image"
    />

    <button
      className={`favorite-btn ${
        favorites[item._id] ? "active" : ""
      }`}
      onClick={() => toggleFavorite(item._id)}
      aria-label="Add to favorites"
    >
      {favorites[item._id] ? "❤️" : "🤍"}
    </button>

  </div>
            <div className="category-food-body">
              <div className="food-badge-row">
                {item.offerText ? (
                  <span className="food-badge offer">{item.offerText}</span>
                ) : null}
                {item.isTrending ? (
                  <span className="food-badge trending">Trending</span>
                ) : null}
                {item.isNewItem ? (
                  <span className="food-badge new">New</span>
                ) : null}
              </div>
              <div className="category-food-top">
                <h3>{item.itemName}</h3>
                <span>Rs. {item.price}</span>
              </div>
              <p>{item.description || "Freshly prepared and ready to order."}</p>
              <div className="category-food-actions">
                <Link to={`/food-menu/item/${item._id}`} className="zomato-card-link">
                  View item
                </Link>
                <button
                  className="food-btn"
                  onClick={() => {
                    addToCart(item, 1);
                    alert("Added to cart");
                  }}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
