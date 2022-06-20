const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    name: {
      first_name : String,
      second_name : String
    },
    fecha_nacimiento : Number,
    email: String,
    password: String,
    nivel: {
      nivelT : Number,
      puntuacionT : Number,
      puntuacionS : Number
    },
    logros: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        tipo: String,
        descripcion: String,    
      }
    ],
    fisico: {
      altura : Number,
      peso_actual : Number,
      peso_ideal: Number,

    },
    historial_peso: [
      {
      fecha:Number,
      peso: Number
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