const mongoose = require("mongoose");

const User = mongoose.model(
  "Badge",
  new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    level: {
      type : Number,
      required : true
    },
    score :{
        type: Number,
        required : true
    },

  })
  
);
module.exports = User;