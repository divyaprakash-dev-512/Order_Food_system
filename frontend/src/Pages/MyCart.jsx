import React, { useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { clearCart, getCartItems, removeFromCart, updateCartQuantity } from "../utils/cart";
import "../styling/cart.css";

const API_BASE_URL = "https://order-food-backend-nfua.onrender.com";

const buildImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80";
  }
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

export default function MyCart() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [cartItems, setCartItems] = useState(getCartItems());
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    houseNumber: "",
    streetName: "",
    area: "",
    landmark: "",
    city: "",
  });

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  }, [cartItems]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // --- RAZORPAY SDK LOADER ---
  const loadRazorpaySDK = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- REAL RAZORPAY INTEGRATION ---
  const handleOnlinePayment = async (orderPayload) => {
    setLoading(true);
    const isLoaded = await loadRazorpaySDK();

    if (!isLoaded) {
      alert("Razorpay SDK load nahi ho paaya. Internet connection check karo.");
      setLoading(false);
      return;
    }

    try {
      // 1. Backend se Razorpay Order ID generate karao
      const { data } = await axios.post(`${API_BASE_URL}/api/pay/order`, {
        amount: totalAmount,
      });

      if (!data.success) {
        alert(data.message || "Razorpay Order ID create nahi ho paaya.");
        setLoading(false);
        return;
      }

      const { order, key } = data;

      // 2. Razorpay Popup Configuration
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Foodie Hub",
        description: "Food Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Payment Verify Karo Backend Par
            const verifyRes = await axios.post(`${API_BASE_URL}/api/pay/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              // Verification passed -> Save Final Order in DB
              submitFinalOrder({
                ...orderPayload,
                paymentStatus: "Paid",
                paymentDetails: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                },
              });
            }
          } catch (err) {
            alert(err.response?.data?.message || "Payment Verification Failed!");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#ff4d4f",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (error) {
  console.error("Full Payment Error:", error);
  const serverMessage = error.response?.data?.message || error.message;
  alert(`Payment Error: ${serverMessage}`);
  setLoading(false);
}
  };

  // --- SUBMIT LOGIC ---
  const handlePlaceOrder = async () => {
    if (!user?._id) return alert("Please login first");
    if (!address.houseNumber || !address.streetName || !address.area || !address.city) {
      return alert("Please fill address details");
    }

    const payload = {
      userId: user._id,
      items: cartItems,
      address,
      totalAmount,
      paymentMethod,
    };

    if (paymentMethod === "Online") {
      handleOnlinePayment(payload);
    } else {
      submitFinalOrder({ ...payload, paymentStatus: "Pending" });
    }
  };

  const submitFinalOrder = async (finalPayload) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/orders`, finalPayload);
      clearCart();
      setCartItems([]);
      alert(`Order placed successfully! Order ID: ${res.data.data.orderNumber}`);
      navigate("/account");
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        alert("Backend server start nahi hai. Pehle backend me node server.js chalao.");
      } else {
        alert(error.response?.data?.message || "Failed to save order");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cart-page-shell">
      <div className="cart-layout">
        <div className="cart-list-card">
          <div className="cart-head-row">
            <h1>My Cart</h1>
            <Link to="/" className="cart-back-link">Continue shopping</Link>
          </div>
          {cartItems.length === 0 ? (
            <div className="cart-empty-box">
              <h3>Your cart is empty</h3>
              <p>Add your favourite food items and they will appear here.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item-row" key={item._id}>
                <img
                  className="cart-item-image"
                  src={buildImageUrl(item.image)}
                  alt={item.itemName}
                />
                <div className="cart-item-body">
                  <h3>{item.itemName}</h3>
                  <p>Rs. {item.price} each</p>
                  <div className="cart-qty-control">
                    <button
                      type="button"
                      onClick={() => {
                        const nextItems = updateCartQuantity(item._id, item.quantity - 1);
                        setCartItems(nextItems);
                      }}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextItems = updateCartQuantity(item._id, item.quantity + 1);
                        setCartItems(nextItems);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-side">
                  <strong>Rs. {Number(item.price) * Number(item.quantity)}</strong>
                  <button
                    className="cart-remove-btn"
                    type="button"
                    onClick={() => setCartItems(removeFromCart(item._id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary-card">
          <h2>Delivery Details</h2>
          <div className="cart-address-grid">
            <input name="houseNumber" placeholder="House No" onChange={handleAddressChange} />
            <input name="streetName" placeholder="Street" onChange={handleAddressChange} />
            <input name="area" placeholder="Area" onChange={handleAddressChange} />
            <input name="city" placeholder="City" onChange={handleAddressChange} />
          </div>

          <div className="payment-options-box" style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Payment Method</h3>
            <label style={{ display: 'block', cursor: 'pointer', margin: '5px 0' }}>
              <input 
                type="radio" 
                name="payMethod" 
                value="COD" 
                checked={paymentMethod === "COD"} 
                onChange={() => setPaymentMethod("COD")} 
              /> Cash on Delivery
            </label>
            <label style={{ display: 'block', cursor: 'pointer', margin: '5px 0' }}>
              <input 
                type="radio" 
                name="payMethod" 
                value="Online" 
                checked={paymentMethod === "Online"} 
                onChange={() => setPaymentMethod("Online")} 
              /> Online Payment (Razorpay UPI/Card)
            </label>
          </div>

          <div className="cart-total-row">
            <span>Total Amount</span>
            <strong>Rs. {totalAmount}</strong>
          </div>

          <button 
            className="cart-order-btn" 
            onClick={handlePlaceOrder} 
            disabled={cartItems.length === 0 || loading}
          >
            {loading ? "Processing..." : paymentMethod === "Online" ? "Pay & Order" : "Place Order (COD)"}
          </button>
        </div>
      </div>
    </section>
  );
}