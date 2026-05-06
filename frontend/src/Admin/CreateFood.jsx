import React, { useState } from "react";
import axios from "axios";
import "../admincss/foodForm.css";
import { CATEGORY_OPTIONS } from "../data/categories";

export default function CreateFood() {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);

    setForm({
      ...form,
      images: files,
    });

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreview(previewUrls);
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

      form.images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post("http://localhost:5533/api/create-food", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Food added successfully");
      setForm({
        itemName: "",
        description: "",
        price: "",
        category: "",
        offerText: "",
        isTrending: false,
        isNewItem: false,
        images: [],
      });
      setPreview([]);
    } catch (error) {
      console.log(error);
      alert("Error adding food");
    }
  };

  return (
    <div className="form-container">
      <div className="form-heading-block">
        <p className="form-kicker">Admin form</p>
        <h2>Add New Food Item</h2>
        <p className="form-helper">
          Add offer text, trending, and new-item badges so the home page banners
          and cuisine sections can update from admin.
        </p>
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
          placeholder="Offer text like 20% OFF or Free Drink Combo"
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
            <img key={i} src={img} alt="preview" />
          ))}
        </div>

        <button type="submit">Add Food</button>
      </form>
    </div>
  );
}
