import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/account.css";

const API_BASE_URL = "https://order-food-backend-nfua.onrender.com";

const statusTextMap = {
  pending: "Awaiting admin decision",
  confirmed: "Confirmed by Aryan",
  rejected: "Your order Successfully unsuccessful",
};

const Account = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [activeTab, setActiveTab] = useState("orders");

  // Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =========================
  // FETCH ORDERS
  // =========================

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/orders/user/${user._id}`
        );

        setOrders(res.data.data || []);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };

    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [user?._id, activeTab]);

  // =========================
  // FETCH FAVORITES
  // =========================

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/favorites/${user._id}`
        );

        setFavorites(res.data.data || []);
      } catch (error) {
        console.log("Error fetching favorites:", error);
      }
    };

    if (activeTab === "favorites") {
      fetchFavorites();
    }
  }, [user?._id, activeTab]);

  // =========================
  // REMOVE FAVORITE
  // =========================

  const removeFavorite = async (foodId) => {
    if (!user?._id) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/favorites/${user._id}/${foodId}`
      );

      setFavorites((prev) =>
        prev.filter((favorite) => favorite.food?._id !== foodId)
      );

      alert("Removed from favorites");
    } catch (error) {
      console.log("Error removing favorite:", error);

      alert(
        error.response?.data?.message ||
          "Unable to remove favorite"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/users/change-password`,
        {
          userId: user._id,
          ...passwordData,
        }
      );

      alert("Password updated successfully!");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error updating password"
      );
    }
  };

  return (
    <section className="u-dash-viewport">

      <div className="u-dash-layout">

        {/* =====================================
            SIDEBAR
        ===================================== */}

        <aside className="u-dash-panel">

          <div className="u-dash-user-head">

            <div className="u-dash-avatar-circle">
              <span className="u-dash-user-icon">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>

            <div className="u-dash-user-meta">

              <h4 className="u-dash-user-name">
                {user?.name || "User"}
              </h4>

              <p className="u-dash-user-email">
                {user?.email || "No Email"}
              </p>

              <button
                className="u-dash-logout-trigger"
                onClick={handleLogout}
              >
                Sign Out
              </button>

            </div>

          </div>

          {/* SIDEBAR MENU */}

          <nav className="u-dash-menu">

            {/* ORDERS */}

            <button
              className={`u-dash-menu-link ${
                activeTab === "orders"
                  ? "u-dash-menu-link--active"
                  : ""
              }`}
              onClick={() => setActiveTab("orders")}
            >
              My Orders
            </button>

            {/* FAVORITES */}

            <button
              className={`u-dash-menu-link ${
                activeTab === "favorites"
                  ? "u-dash-menu-link--active"
                  : ""
              }`}
              onClick={() => setActiveTab("favorites")}
            >
              ❤️ My Favorites
            </button>

            {/* PROFILE */}

            <button
              className={`u-dash-menu-link ${
                activeTab === "profile"
                  ? "u-dash-menu-link--active"
                  : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Details
            </button>

            {/* PASSWORD */}

            <button
              className={`u-dash-menu-link ${
                activeTab === "password"
                  ? "u-dash-menu-link--active"
                  : ""
              }`}
              onClick={() => setActiveTab("password")}
            >
              Change Password
            </button>

          </nav>

        </aside>

        {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <main className="u-dash-main">

          {/* =====================================
              ORDERS TAB
          ===================================== */}

          {activeTab === "orders" && (
            <>

              <h2 className="u-dash-title">
                MY ORDERS
              </h2>

              {orders.length === 0 ? (

                <div className="u-order-empty">
                  No orders placed yet.
                </div>

              ) : (

                <div className="u-order-stack">

                  {orders.map((order) => (

                    <div
                      className="u-order-item-card"
                      key={order._id}
                    >

                      <div className="u-order-info-area">

                        <p className="u-order-timestamp">
                          Order Date:

                          <span className="u-order-date-highlight">
                            {" "}
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </p>

                        <h3 className="u-order-serial-no">
                          Order # {order.orderNumber}
                        </h3>

                        <button
                          className={`u-btn-status-info u-btn-status-${order.status}`}
                        >
                          {statusTextMap[order.status]}
                        </button>

                        <div className="u-order-summary">

                          <p>
                            <strong>Total:</strong>{" "}
                            Rs. {order.totalAmount}
                          </p>

                          <p>
                            <strong>Items:</strong>{" "}
                            {order.items
                              .map(
                                (item) =>
                                  `${item.itemName} x ${item.quantity}`
                              )
                              .join(", ")}
                          </p>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </>
          )}

          {/* =====================================
              FAVORITES TAB
          ===================================== */}

          {activeTab === "favorites" && (
            <div className="u-favorites-section">

              <h2 className="u-dash-title">
                MY FAVORITES ❤️
              </h2>

              {favorites.length === 0 ? (

                <div className="u-order-empty">
                  You haven't added any favorites yet.
                </div>

              ) : (

                <div className="u-favorites-grid">

                  {favorites.map((favorite) => {

                    const food = favorite.food;

                    if (!food) return null;

                    const imageUrl =
                      food.images?.[0]
                        ? food.images[0].startsWith("http")
                          ? food.images[0]
                          : `${API_BASE_URL}${food.images[0]}`
                        : "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";

                    return (

                      <div
                        className="u-favorite-card"
                        key={favorite._id}
                      >

                        {/* FOOD IMAGE */}

                        <div className="u-favorite-image-wrapper">

                          <img
                            src={imageUrl}
                            alt={food.itemName}
                            className="u-favorite-image"
                          />

                          {/* HEART */}

                          <button
                            className="u-favorite-heart"
                            onClick={() =>
                              removeFavorite(food._id)
                            }
                          >
                            ❤️
                          </button>

                        </div>

                        {/* FOOD INFO */}

                        <div className="u-favorite-info">

                          <h3>
                            {food.itemName}
                          </h3>

                          <p>
                            {food.description ||
                              "Delicious food ready to order."}
                          </p>

                          <div className="u-favorite-bottom">

                            <strong>
                              Rs. {food.price}
                            </strong>

                          </div>

                        </div>

                      </div>

                    );
                  })}

                </div>

              )}

            </div>
          )}

          {/* =====================================
              PROFILE TAB
          ===================================== */}

          {activeTab === "profile" && (
            <div className="u-profile-section">

              <h2 className="u-dash-title">
                MY PROFILE
              </h2>

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

          {/* =====================================
              PASSWORD TAB
          ===================================== */}

          {activeTab === "password" && (
            <div className="u-password-section">

              <h2 className="u-dash-title">
                CHANGE PASSWORD
              </h2>

              <form
                className="u-password-form"
                onSubmit={handlePasswordChange}
              >

                <div className="u-input-group">

                  <label>
                    Current Password
                  </label>

                  <input
                    type="password"
                    required
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="u-input-group">

                  <label>
                    New Password
                  </label>

                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="u-input-group">

                  <label>
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />

                </div>

                <button
                  type="submit"
                  className="u-dash-save-btn"
                >
                  Update Password
                </button>

              </form>

            </div>
          )}

        </main>

      </div>

    </section>
  );
};

export default Account;