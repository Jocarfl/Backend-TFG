const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true
  },
    email: {
      type: String,
      required: true
  },
    password: {
      type: String,
      required: true
  },
    first_name: {
      type: String,
      required: true
  },
  second_name: {
      type: String
  },
  dni: {
    type: String,
    required: true
  },
  born_date: {
      type: String,
      required: true
  },
  height: {
      type: Number
  },
  weight: {
      type: Number
  },
  ideal_weight: {
      type: Number
  },
  id_mod:{
    type: mongoose.Schema.Types.ObjectId
  },
  weight_history: [
      {
          date: {
              type: Date,
              required: true
          },
          weight: {
              type: Number,
              required: true
          }, 
          _id:false  
      }
  ],
  recomendations:[
    {
      date:{
        type: Date,
        required: true
      },
      title:{
        type: String,
        required: true
      },
      description:{
        type: String,
        required: true
      },
      completed:{
        type: Boolean,
        required: true
      },
      _id:false
    }
  ],
  roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
  
);
module.exports = User;