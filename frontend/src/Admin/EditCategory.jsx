import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../admincss/foodForm.css";

const API_BASE_URL = "https://order-food-backend-nfua.onrender.com";

export default function EditCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate(); 
  const [newCategory, setNewCategory] = useState(categoryId || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`${API_BASE_URL}/api/category`, {
        oldCategory: categoryId,
        newCategory,
      });
      setMessage("Category updated successfully.");
      setTimeout(() => navigate("/food-category"), 800);
    } catch (error) {
      console.log(error);
      setMessage("Unable to update category.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-heading-block">
        <p className="form-kicker">Admin form</p>
        <h2>Edit Category</h2>
        <p className="form-helper">
          This will rename the category across all foods using it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <input type="text" value={categoryId} disabled />
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category id"
          required
        />

        {message ? <p className="form-message">{message}</p> : null}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
