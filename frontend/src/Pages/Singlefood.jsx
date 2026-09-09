import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { addToCart } from "../utils/cart";
import "../styling/cart.css";

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

function Singlefood() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/food/${id}`);
        setFood(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFood();
  }, [id]);

  const handleAddToCart = () => {
    if (!food) return;
    addToCart(food, quantity);
    alert("Added to cart");
  };

  if (!food) return <p className="cart-page-shell">Loading...</p>;

  return (
    <section className="cart-page-shell">
      <div className="single-food-layout">
        <img
          src={buildImageUrl(food.images?.[0])}
          alt={food.itemName}
          className="single-food-image"
        />

        <div className="single-food-content">
          <Link to={`/food-menu/category/${food.category}`} className="cart-back-link">
            Back to category
          </Link>
          <h1>{food.itemName}</h1>
          <p className="single-food-desc">
            {food.description || "Freshly prepared and ready to order."}
          </p>
          <h3 className="single-food-price">Rs. {food.price}</h3>

          <div className="single-food-qty">
            <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
          </div>

          <div className="single-food-actions">
            <button className="food-btn" onClick={handleAddToCart}>
              Add To Cart
            </button>
            <Link to="/myCart" className="single-food-cart-link">
              Go To My Cart
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Singlefood;
