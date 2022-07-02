const mongoose = require("mongoose");

const DailyChallenges = mongoose.model(
  "DailyChallenges",
  new mongoose.Schema({
    name: {
        type : String,
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
module.exports = DailyChallenges;