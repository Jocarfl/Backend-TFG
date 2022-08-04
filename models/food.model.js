const mongoose = require("mongoose");

const Food = mongoose.model(
  "Food",
  new mongoose.Schema({
    id: {
        type: String,
        required : true
    },
    nombre: {
      type : String
    },
    tipo:{
        type: Array
    },
    energiaT:{
        type: String
    },
    grasaT:{
        type: String
    },
    proteinaT:{
        type: String
    },

  })
  
);
module.exports = Food;