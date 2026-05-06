const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createFood,
  getAllFoods,
  getFoodByCategory,
  updateFood,
  deleteFood,
  renameCategory,
  deleteCategory,
} = require("../controller/foodController");



router.get("/show-food", getAllFoods);
router.get("/category/:category", getFoodByCategory);
router.post("/create-food", upload.array("images", 5), createFood);
router.patch("/food/:id", upload.array("images", 5), updateFood);
router.delete("/food/:id", deleteFood);
router.patch("/category", renameCategory);
router.delete("/category/:category", deleteCategory);




module.exports = router;
