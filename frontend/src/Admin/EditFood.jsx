import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../admincss/foodForm.css";
import { CATEGORY_OPTIONS } from "../data/categories";

const API_BASE_URL = "https://order-food-backend-nfua.onrender.com";

export default function EditFood() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
    offerText: "",
    isTrending: false,
    isNewItem: false,
    images: [],
  });
  const [preview, setPreview] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/food/${id}`);
        const food = res.data.data;
        setForm({
          itemName: food.itemName || "",
          description: food.description || "",
          price: food.price || "",
          category: food.category || "",
          offerText: food.offerText || "",
          isTrending: Boolean(food.isTrending),
          isNewItem: Boolean(food.isNewItem),
          images: [],
        });
        setPreview(food.images || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFood();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: files }));
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("itemName", form.itemName);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("offerText", form.offerText);
      formData.append("isTrending", String(form.isTrending));
      formData.append("isNewItem", String(form.isNewItem));
      form.images.forEach((img) => formData.append("images", img));

      await axios.patch(`${API_BASE_URL}/api/food/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Food updated successfully.");
      setTimeout(() => navigate("/food-menu"), 800);
    } catch (error) {
      console.log(error);
      setMessage("Unable to update food.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-heading-block">
        <p className="form-kicker">Admin form</p>
        <h2>Edit Food Item</h2>
        <p className="form-helper">Update all important food details from one place.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <input
          type="text"
          name="itemName"
          placeholder="Food Name"
          value={form.itemName}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <div className="form-row-two">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          name="offerText"
          placeholder="Offer text"
          value={form.offerText}
          onChange={handleChange}
        />

        <div className="form-flag-row">
          <label className="form-flag-pill">
            <input
              type="checkbox"
              name="isTrending"
              checked={form.isTrending}
              onChange={handleChange}
            />
            Trending item
          </label>
          <label className="form-flag-pill">
            <input
              type="checkbox"
              name="isNewItem"
              checked={form.isNewItem}
              onChange={handleChange}
            />
            New item
          </label>
        </div>

        <input type="file" multiple onChange={handleImage} />

        <div className="preview">
          {preview.map((img, i) => (
            <img
              key={i}
              src={img.startsWith?.("/uploads") ? `${API_BASE_URL}${img}` : img}
              alt="preview"
            />
          ))}
        </div>

        {message ? <p className="form-message">{message}</p> : null}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
