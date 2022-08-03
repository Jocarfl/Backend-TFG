const mongoose = require("mongoose");

const Badge = mongoose.model(
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
module.exports = Badge;