const Favorite = require('../model/favorite');

const addFavorite = async (req, res) => {
  try {
    const { userId, foodId } = req.body;
    console.log("here is id's:",userId,foodId);

    if (!userId || !foodId) {
      return res.status(400).json({
        success: false,
        message: "userId and foodId are required",
      });
    }

    const existingFavorite = await Favorite.findOne({
      user: userId,
      food: foodId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Food already added to favorites",
      });
    }

    const favorite = await Favorite.create({
      user: userId,
      food: foodId,
    });

    res.status(201).json({
      success: true,
      message: "Food added to favorites",
      favorite,
    });
  } catch (error) {
    console.error("Add favorite error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const favorites = await Favorite.find({
      user: userId,
    }).populate("food");

    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { userId, foodId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      food: foodId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food removed from favorites",
    });
  } catch (error) {
    console.error("Remove favorite error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const checkFavorite = async (req, res) => {
  try {
    const { userId, foodId } = req.params;

    const favorite = await Favorite.findOne({
      user: userId,
      food: foodId,
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("Check favorite error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
  checkFavorite,
};