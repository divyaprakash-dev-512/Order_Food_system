import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/account.css";

const API_BASE_URL = "http://localhost:5533";

const statusTextMap = {
  pending: "Awaiting admin decision",
  confirmed: "Confirmed by Aryan",
  rejected: "Your order Successfully unsuccessful",
};

const Account = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("orders"); // Tabs: orders, profile, password
  
  // State for Password Change
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/orders/user/${user._id}`);
        setOrders(res.data.data || []);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };
    if (activeTab === "orders") fetchOrders();
  }, [user?._id, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      // Backend route /api/users/change-password replace kar lena apne hisab se
      await axios.post(`${API_BASE_URL}/api/users/change-password`, {
        userId: user._id,
        ...passwordData,
      });
      alert("Password updated successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Error updating password");
    }
  };

  return (
    <section className="u-dash-viewport">
      <div className="u-dash-layout">
        {/* Sidebar */}
        <aside className="u-dash-panel">
          <div className="u-dash-user-head">
            <div className="u-dash-avatar-circle">
              <span className="u-dash-user-icon">{user?.name?.charAt(0) || "U"}</span>
            </div>
            <div className="u-dash-user-meta">
              <h4 className="u-dash-user-name">{user?.name || "User"}</h4>
              <p className="u-dash-user-email">{user?.email || "No Email"}</p>
              <button className="u-dash-logout-trigger" onClick={handleLogout}>Sign Out</button>
            </div>
          </div>

          <nav className="u-dash-menu">
            <button 
              className={`u-dash-menu-link ${activeTab === "orders" ? "u-dash-menu-link--active" : ""}`}
              onClick={() => setActiveTab("orders")}
            > My Orders </button>
            <button 
              className={`u-dash-menu-link ${activeTab === "profile" ? "u-dash-menu-link--active" : ""}`}
              onClick={() => setActiveTab("profile")}
            > Profile Details </button>
            <button 
              className={`u-dash-menu-link ${activeTab === "password" ? "u-dash-menu-link--active" : ""}`}
              onClick={() => setActiveTab("password")}
            > Change Password </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="u-dash-main">
          
          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <>
              <h2 className="u-dash-title">MY ORDERS</h2>
              {orders.length === 0 ? (
                <div className="u-order-empty">No orders placed yet.</div>
              ) : (
                <div className="u-order-stack">
                  {orders.map((order) => (
                    <div className="u-order-item-card" key={order._id}>
                      <div className="u-order-info-area">
                        <p className="u-order-timestamp">
                          Order Date: <span className="u-order-date-highlight">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </p>
                        <h3 className="u-order-serial-no">Order # {order.orderNumber}</h3>
                        <button className={`u-btn-status-info u-btn-status-${order.status}`}>
                          {statusTextMap[order.status]}
                        </button>
                        <div className="u-order-summary">
                          <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
                          <p><strong>Items:</strong> {order.items.map((item) => `${item.itemName} x ${item.quantity}`).join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="u-profile-section">
              <h2 className="u-dash-title">MY PROFILE</h2>
              <div className="u-profile-card">
                <div className="u-profile-field">
                  <label>Full Name</label>
                  <p>{user?.name}</p>
                </div>
                <div className="u-profile-field">
                  <label>Email Address</label>
                  <p>{user?.email}</p>
                </div>
                <div className="u-profile-field">
                  <label>Account ID</label>
                  <p>{user?._id}</p>
                </div>
              </div>
            </div>
          )}

          {/* PASSWORD TAB */}
          {activeTab === "password" && (
            <div className="u-password-section">
              <h2 className="u-dash-title">CHANGE PASSWORD</h2>
              <form className="u-password-form" onSubmit={handlePasswordChange}>
                <div className="u-input-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    required 
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                  />
                </div>
                <div className="u-input-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <div className="u-input-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
                <button type="submit" className="u-dash-save-btn">Update Password</button>
              </form>
            </div>
          )}

        </main>
      </div>
    </section>
  );
};

export default Account;