import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styling/home.css";
import { CATEGORY_NAME_MAP, CATEGORY_OPTIONS } from "../data/categories";
import Category from "./Category";
import DrinkCategory from "./DrinkCategory";
import HeroSecond from "./HeroSecond";

const API_BASE_URL = "http://localhost:5533";

const buildImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${API_BASE_URL}${imagePath}`;
};

const categoryMetaMap = CATEGORY_OPTIONS.reduce((acc, category) => {
  acc[category.id] = category;
  return acc;
}, {});


export default function Home() {
  const [foodList, setFoodList] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/show-food`);
        setFoodList(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFoodData();
  }, []);

  const categoryLinks = useMemo(() => {
    const dynamicCategories = [...new Set(foodList.map((item) => item.category).filter(Boolean))];
    return dynamicCategories.sort((a, b) => {
      const aName = CATEGORY_NAME_MAP[a] || a;
      const bName = CATEGORY_NAME_MAP[b] || b;
      return aName.localeCompare(bName);
    });
  }, [foodList]);

  const categoryCounts = useMemo(() => {
    return foodList.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
  }, [foodList]);

  const popularFoods = useMemo(() => {
    return [...foodList]
      .sort((a, b) => {
        const scoreA =
          (a.isTrending ? 4 : 0) + (a.isNewItem ? 2 : 0) + Number(a.rating || 0);
        const scoreB =
          (b.isTrending ? 4 : 0) + (b.isNewItem ? 2 : 0) + Number(b.rating || 0);
        return scoreB - scoreA;
      })
      .slice(0, 6);
  }, [foodList]);

  const cuisineSections = useMemo(() => {
    return categoryLinks.map((categoryId) => ({
      id: categoryId,
      title: CATEGORY_NAME_MAP[categoryId] || categoryId,
      description:
        categoryMetaMap[categoryId]?.description ||
        "Fresh picks prepared across this category.",
      items: [...foodList]
        .filter((item) => item.category === categoryId)
        .sort((a, b) => {
          if (a.isTrending !== b.isTrending) {
            return a.isTrending ? -1 : 1;
          }
          if (a.isNewItem !== b.isNewItem) {
            return a.isNewItem ? -1 : 1;
          }
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }),
    })).filter((section) => section.items.length > 0);
  }, [categoryLinks, foodList]);

  const serviceHighlights = useMemo(() => {
    return [
      {
        title: "Wide category range",
        value: `${categoryLinks.length}+`,
        copy: "Every food category added by admin now shows up on the home page.",
      },
      {
        title: "Live food count",
        value: `${foodList.length}+`,
        copy: "Fresh menu items stay visible here without needing separate manual updates.",
      },
      {
        title: "Fast picks",
        value: `${popularFoods.length}`,
        copy: "Trending and newly added dishes are highlighted first for quick discovery.",
      },
    ];
  }, [categoryLinks.length, foodList.length, popularFoods.length]);

  const handleLoginChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegData({
      ...regData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setShowLogin(false);
        window.location.reload();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  const handleRegister = async () => {
    if (regData.password !== regData.cpassword) {
      alert("Password does not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(regData),
      });

      const data = await res.json();
      alert(data.message);
      setShowRegister(false);
    } catch (err) {
      console.log(err);
    }
  };

  const renderBadges = (item) => (
    <div className="food-badge-row">
      {item.offerText ? <span className="food-badge offer">{item.offerText}</span> : null}
      {item.isTrending ? <span className="food-badge trending">Trending</span> : null}
      {item.isNewItem ? <span className="food-badge new">New</span> : null}
    </div>
  );

  const renderFoodCard = (item, featured = false) => (
    <article
      className={featured ? "zomato-card zomato-card-featured" : "zomato-card"}
      key={item._id}
    >
      <img
        src={buildImageUrl(item.images?.[0])}
        alt={item.itemName}
        className="zomato-card-image"
      />
      <div className="zomato-card-body">
        {renderBadges(item)}
        <div className="zomato-card-top">
          <h3>{item.itemName}</h3>
          <span>Rs. {item.price}</span>
        </div>
        <p>{item.description || "Freshly prepared and delivered hot."}</p>
        <Link to={`/food-menu/item/${item._id}`} className="zomato-card-link">
          View items
        </Link>
      </div>
    </article>
  );

  return (
    <div className="home">
      <div className="topbar">
        <p>Free delivery on orders above Rs. 199</p>

        <div className="auth-btns">
          {user ? (
            <Link to="/account" className="login-btn">
              My Account
            </Link>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="login-btn">
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="register-btn"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      <div className="custom-navbar">
        <h2 className="custom-logo">Foodie</h2>

        <div className="custom-nav-links">
          <Link to="/">Home</Link>

          <div className="custom-menu-dropdown">
            <button type="button" className="custom-menu-title">
              Explore Menu
            </button>

            <div className="custom-menu-items custom-menu-grid">
              {categoryLinks.map((category) => (
                <Link key={category} to={`/food-menu/category/${category}`} className="custom-menu-card">
                  <strong>{CATEGORY_NAME_MAP[category] || category}</strong>
                  <span>{categoryCounts[category] || 0} items</span>
                </Link>
              ))}
            </div>
          </div>

          <a href="#popular-foods">Popular</a>
          {categoryLinks.slice(0, 3).map((category) => (
            <a key={category} href={`#${category}-section`}>
              {CATEGORY_NAME_MAP[category] || category}
            </a>
          ))}
        </div>

        <Link to="/myCart" className="custom-cart-btn">
          Cart
        </Link>
      </div>

      <div className="hero hero-zomato">
        <div className="overlay"></div>

        <div className="hero-content hero-content-wide">
          <p className="hero-pill">Trending menus and curated offers</p>
          <h1>Discover food, offers and fresh arrivals near you</h1>
          <p>
            Your admin can now mark items as trending, new, or offer-ready and
            they will reflect across the home page.
          </p>

          <div className="search-box">
            <input type="text" placeholder="Search for biryani, pizza, dosa..." />
            <button>Search</button>
          </div>

          <div className="hero-quick-links">
            {categoryLinks.map((sectionId) => (
              <a key={sectionId} href={`#${sectionId}-section`}>
                {CATEGORY_NAME_MAP[sectionId] || sectionId}
              </a>
            ))}
          </div>
        </div>
      </div>

      {showLogin && (
        <div className="popup-overlay">
          <div className="popup">
            <span className="close" onClick={() => setShowLogin(false)}>
              x
            </span>

            <h2>Login</h2>
            <input
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleLoginChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleLoginChange}
            />
            <button onClick={handleLoginSubmit}>Login</button>

            <p
              onClick={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
              style={{ cursor: "pointer" }}
            >
              Don't have an account? Register
            </p>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="popup-overlay">
          <div className="popup">
            <span className="close" onClick={() => setShowRegister(false)}>
              x
            </span>

            <h2>Register</h2>
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleRegisterChange}
            />
            <input
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleRegisterChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleRegisterChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="cpassword"
              onChange={handleRegisterChange}
            />
            <button onClick={handleRegister}>Register</button>

            <p
              onClick={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
              style={{ cursor: "pointer" }}
            >
              Already have an account? Login
            </p>
          </div>
        </div>
      )}

      <section id="popular-foods" className="home-food-section">
        <div className="home-section-header">
          <div>
            <p className="category-kicker">Popular food</p>
            <h2>Trending dishes this week</h2>
          </div>
          <p className="home-section-copy">
            Trending and new items rise to the top from the admin panel.
          </p>
        </div>

        <div className="zomato-grid">
          {popularFoods.length > 0 ? (
            popularFoods.map((item, index) => renderFoodCard(item, index === 0))
          ) : (
            <p className="category-empty-state">
              Add some foods from admin to show popular dishes here.
            </p>
          )}
        </div>
      </section>


      {cuisineSections.map((section) => (
        <section
          key={section.id}
          id={`${section.id}-section`}
          className="home-food-section"
        >
          <div className="home-section-header">
            <div>
              <p className="category-kicker">Cuisine section</p>
              <h2>{section.title}</h2>
              <p className="home-section-copy">{section.description}</p>
            </div>
          <Link to={`/food-menu/category/${section.id}`} className="home-section-link">
              See all
            </Link>
          </div>

          <div className="cuisine-feature-grid">
            {section.items.map((item, index) => (
              <article
                key={item._id}
                className={index === 0 ? "cuisine-card cuisine-card-large" : "cuisine-card"}
              >
                <img
                  src={buildImageUrl(item.images?.[0])}
                  alt={item.itemName}
                  className="cuisine-card-image"
                />
                <div className="cuisine-card-body">
                  {renderBadges(item)}
                  <div className="cuisine-card-header">
                    <h3>{item.itemName}</h3>
                    <span>Rs. {item.price}</span>
                  </div>
                  <p>{item.description || "Chef-made and ready to order."}</p>
                  <Link to={`/food-menu/item/${item._id}`} className="zomato-card-link">
                    View item
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

  <Category/>
  <DrinkCategory/>
  <HeroSecond/>
      

      <section className="home-highlights-section">
        <div className="home-section-header home-section-header-stack">
          <div>
            <p className="category-kicker">Why people love it</p>
            <h2>More variety, better discovery</h2>
          </div>
          <p className="home-section-copy">
            I added one extra section so the home page feels richer and shows useful store highlights at a glance.
          </p>
        </div>

        <div className="home-highlights-grid">
          {serviceHighlights.map((highlight) => (
            <article key={highlight.title} className="home-highlight-card">
              <span className="home-highlight-value">{highlight.value}</span>
              <h3>{highlight.title}</h3>
              <p>{highlight.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <h3>Foodie</h3>
            <p>
              Fresh meals, trending picks, and every active category collected in one easy home experience.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <div className="site-footer-links">
              <a href="#popular-foods">Popular foods</a>
              {categoryLinks.slice(0, 4).map((category) => (
                <a key={category} href={`#${category}-section`}>
                  {CATEGORY_NAME_MAP[category] || category}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4>Quick info</h4>
            <div className="site-footer-links">
              <span>{foodList.length} total items</span>
              <span>{categoryLinks.length} live categories</span>
              <span>Daily offers and trending picks</span>
            </div>
          </div>
        </div>
        <p className="site-footer-bottom">
          Foodie kitchen picks, handcrafted for hungry customers.
        </p>
      </footer>
    </div>
    
  );
}