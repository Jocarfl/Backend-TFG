const mongoose = require("mongoose");

const FoodHistory = mongoose.model(
  "FoodHistory",
  new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    data :[{
        date: {
            type : String
          },
        meals: [{
          name: {
            type : String
          },
          food: {
            type : Array
          }
          }],      
    }],

  })
  
);
module.exports = FoodHistory;