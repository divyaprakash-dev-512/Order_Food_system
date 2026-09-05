const express = require("express");
const router = express.Router();

const {
  addFavorite,
  getFavorites,
  removeFavorite,
  checkFavorite,
} = require("../controller/FavoriteController");

router.post("/favorites", addFavorite);
router.get("/favorites/:userId", getFavorites);
router.get("/favorites/:userId/:foodId", checkFavorite);
router.delete("/favorites/:userId/:foodId", removeFavorite);

module.exports = router;