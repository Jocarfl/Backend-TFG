const mongoose = require("mongoose");
const Badge = require('./badge.model');

const Gamification = mongoose.model(
  "Gamification",
  new mongoose.Schema({
    id_user: {
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
    badges: {
        type: [Badge]
    }

  })
  
);
module.exports = Gamification;