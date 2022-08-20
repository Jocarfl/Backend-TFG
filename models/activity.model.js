const mongoose = require("mongoose");

const Activity = mongoose.model(
  "Activity",
  new mongoose.Schema({
    user: {
      type : String,
      required : true
    },
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      required : true
    },
    description:{
        type: String,
        required : true
    }
  })
  
);
module.exports = Activity;