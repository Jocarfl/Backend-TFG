const mongoose = require("mongoose");


const Gamification = mongoose.model(
  "Gamification",
  new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    retos_diarios : {
      lista_retos : [
        {_id: mongoose.Schema.Types.ObjectId,
          title: String,
          description: String,
          level: Number,
          completed: Boolean  
        }],
      date: Date,
    }
  })
  
);
module.exports = Gamification;