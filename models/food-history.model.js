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
            type : Date
          },
        comidas: {
          desayuno : {
            type : JSON
          },
          almuerzo : {
            type : JSON
          },
          comida : {
            type : JSON
          },
          merienda : {
            type : JSON
          },
          cena : {
            type : JSON
          }
          }, 
          _id:false     
    }],

  })
  
);
module.exports = FoodHistory;