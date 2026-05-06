const mongoose = require('mongoose');

const foodmenuSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: [String],
  offerText: {
    type: String,
    trim: true,
    default: ""
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isNewItem: {
    type: Boolean,
    default: false
  },

  isAvailable: {
    type: Boolean,
    default: true
  },

 

}, { timestamps: true });

module.exports = mongoose.model("Foodmenu", foodmenuSchema);
