const mongoose = require("mongoose");

const DailyChallenges = mongoose.model(
  "DailyChallenges",
  new mongoose.Schema({
    title: {
        type : String,
        required : true
      },
      description:{
        type: String,
        required: true
      },
    level: {
      type : Number,
      required : true
    },
    completed:{
      type : Boolean,
      required : true}
  })
  
);
module.exports = DailyChallenges;