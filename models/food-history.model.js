const mongoose = require("mongoose");

const FoodHistory = mongoose.model(
  "FoodHistory",
  new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    data :[{
        date: {
            type : Date,
            required : true
          },
        meals: [{
          name: {
            type : String,
            required : true
          },
          food: {
            type : Array,
            required : true
          }
          }],      
    }],

  })
  
);
module.exports = FoodHistory;