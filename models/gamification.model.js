const mongoose = require("mongoose");

const Gamification = mongoose.model(
  "Gamification",
  new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
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
    limit_score :{
      type:Number
    },
    weekly_score:{
      type: Number,
      required : true
    },
    badges: [
      {     
        name: {
          type: String,
          required: true
      },
      level: {
          type: Number,
          required: true
      }

      }
    ]

  })
  
);
module.exports = Gamification;