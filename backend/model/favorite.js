const mongoose = require('mongoose');
const favoriteScehma = new mongoose.Schema({

    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref :"User",
        required : true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Foodmenu",
      required: true,
    },
     },
  {
    timestamps: true,
  
}
);

    favoriteScehma.index(
        {user:1 , food:1},
        {unique:true}
    );

    module.exports = mongoose.model("Favorite",favoriteScehma);