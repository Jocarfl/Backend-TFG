const config = require("../config/auth.config");
const db = require("../models");
const FoodHistory = db.foodhistory;

exports.crearRegistroComidaPorId = (id) => {
  new FoodHistory({
    _id: id
  }).save(err => {
    if (err) {
      console.log("error", err);
    }
    console.log("Created User Food History");
  });
};

exports.insertarComidaDiariaPorId = (req,res) => {
FoodHistory.findByIdAndUpdate(req.body.id, {$push: {data: req.body.data}},
  function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Food Data: ", docs);
    }});
};

