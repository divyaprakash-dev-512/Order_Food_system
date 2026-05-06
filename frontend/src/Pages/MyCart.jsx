import React, { useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { clearCart, getCartItems, removeFromCart, updateCartQuantity } from "../utils/cart";
import "../styling/cart.css";

const API_BASE_URL = "http://localhost:5533";

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
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default payment method
  const [paymentNotice, setPaymentNotice] = useState(null);
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [demoPaymentMode, setDemoPaymentMode] = useState("upi");
  const [demoPaymentProcessing, setDemoPaymentProcessing] = useState(false);
  const [pendingOrderPayload, setPendingOrderPayload] = useState(null);
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

  const handleOnlinePayment = async (payload) => {
    setPendingOrderPayload(payload);
    setShowDemoPayment(true);
  };

  const confirmDemoPayment = () => {
    if (!pendingOrderPayload) return;

    setDemoPaymentProcessing(true);
    setTimeout(() => {
      const demoPaymentId = `demo_pay_${Date.now()}`;
      setShowDemoPayment(false);
      setDemoPaymentProcessing(false);
      alert("Payment confirmed");
      submitFinalOrder({
        ...pendingOrderPayload,
        paymentStatus: "Paid",
        razorpayId: demoPaymentId,
      });
      setPendingOrderPayload(null);
    }, 900);
  };

  // --- COMMON SUBMIT LOGIC ---
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
      submitFinalOrder(payload);
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
    }
  };

  return (
    <section className="cart-page-shell">
      {paymentNotice && (
        <div className="payment-modal-backdrop" role="dialog" aria-modal="true">
          <div className={`payment-modal-card ${paymentNotice.type}`}>
            <div className="payment-modal-icon">
              {paymentNotice.type === "loading" ? "..." : "!"}
            </div>
            <h3>{paymentNotice.title}</h3>
            <p>{paymentNotice.message}</p>
            {paymentNotice.type !== "loading" && (
              <button type="button" onClick={() => setPaymentNotice(null)}>
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {showDemoPayment && (
        <div className="demo-pay-backdrop" role="dialog" aria-modal="true">
          <div className="demo-pay-card">
            <div className="demo-pay-header">
              <div>
                <span className="demo-pay-brand">Razorpay</span>
                <h3>Complete Payment</h3>
              </div>
              <button
                type="button"
                className="demo-pay-close"
                onClick={() => {
                  setShowDemoPayment(false);
                  setPendingOrderPayload(null);
                }}
              >
                x
              </button>
            </div>

            <div className="demo-pay-merchant">
              <div className="demo-pay-logo">F</div>
              <div>
                <strong>Foodie App</strong>
                <span>Order payment</span>
              </div>
              <b>Rs. {totalAmount}</b>
            </div>

            <div className="demo-pay-tabs">
              <button
                type="button"
                className={demoPaymentMode === "upi" ? "active" : ""}
                onClick={() => setDemoPaymentMode("upi")}
              >
                UPI
              </button>
              <button
                type="button"
                className={demoPaymentMode === "card" ? "active" : ""}
                onClick={() => setDemoPaymentMode("card")}
              >
                Card
              </button>
            </div>

            {demoPaymentMode === "upi" ? (
              <div className="demo-pay-form">
                <label>
                  UPI ID
                  <input type="text" value="demo@upi" readOnly />
                </label>
                <p>This is a demo payment popup. No real money will be charged.</p>
              </div>
            ) : (
              <div className="demo-pay-form">
                <label>
                  Card Number
                  <input type="text" value="4111 1111 1111 1111" readOnly />
                </label>
                <div className="demo-pay-grid">
                  <label>
                    Expiry
                    <input type="text" value="12/30" readOnly />
                  </label>
                  <label>
                    CVV
                    <input type="password" value="123" readOnly />
                  </label>
                </div>
              </div>
            )}

            <button
              type="button"
              className="demo-pay-confirm"
              onClick={confirmDemoPayment}
              disabled={demoPaymentProcessing}
            >
              {demoPaymentProcessing ? "Processing..." : `Pay Rs. ${totalAmount}`}
            </button>
          </div>
        </div>
      )}

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

          {/* PAYMENT METHOD UI */}
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
              /> Online Payment (UPI/Card)
            </label>
          </div>

          <div className="cart-total-row">
            <span>Total Amount</span>
            <strong>Rs. {totalAmount}</strong>
          </div>

          <button className="cart-order-btn" onClick={handlePlaceOrder} disabled={cartItems.length === 0}>
            {paymentMethod === "Online" ? "Pay & Order" : "Place Order (COD)"}
          </button>
        </div>
      </div>
    </section>
  );
}
