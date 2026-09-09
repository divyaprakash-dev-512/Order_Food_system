const Food = require("../model/foodMenu");

const toStoredImage = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFoodByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const foods = await Food.find({
      category,
      isAvailable: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createFood = async (req, res) => {
  try {
    const {
      itemName,
      description,
      price,
      category,
      offerText,
      isTrending,
      isNewItem,
    } = req.body;

    const imagePaths = Array.isArray(req.files)
      ? req.files.map(toStoredImage)
      : [];

    const newFood = new Food({
      itemName,
      description,
      price,
      category,
      images: imagePaths,
      offerText: offerText || "",
      isTrending: isTrending === "true",
      isNewItem: isNewItem === "true",
    });

    await newFood.save();

    res.status(201).json({
      success: true,
      message: "Food item created successfully",
      data: newFood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//single food nikalne ki api h
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (Array.isArray(req.files) && req.files.length > 0) {
      payload.images = req.files.map(toStoredImage);
    }

    if (typeof payload.isTrending !== "undefined") {
      payload.isTrending = payload.isTrending === "true" || payload.isTrending === true;
    }

    if (typeof payload.isNewItem !== "undefined") {
      payload.isNewItem = payload.isNewItem === "true" || payload.isNewItem === true;
    }

    const updatedFood = await Food.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedFood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);

    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.renameCategory = async (req, res) => {
  try {
    const { oldCategory, newCategory } = req.body;

    if (!oldCategory || !newCategory) {
      return res.status(400).json({
        success: false,
        message: "Both old and new category are required",
      });
    }

    const result = await Food.updateMany(
      { category: oldCategory },
      { $set: { category: newCategory } }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const result = await Food.deleteMany({ category });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
