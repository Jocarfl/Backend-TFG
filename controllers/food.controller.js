const config = require("../config/auth.config");
const db = require("../models");
const FoodHistory = db.foodhistory;

exports.crearRegistroComidaPorId = (id) => {

  FoodHistory.find
  new FoodHistory({
    _id: id
  }).save(err => {
    if (err) {
      console.log("error", err);
    }
  });
};

exports.insertarComidaDiariaPorId = (req,res) => {

  var d = new Date();
  var date = d.getFullYear()+ "-" + d.getMonth() + "-" + d.getDate();

FoodHistory.findByIdAndUpdate(req.body.id, {$push: {data: {date : date , comidas : req.body.comidas}}},
  function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) return res.status(404).send("Id Not found.");
    return res.status(200).send('Succesfully saved.');});
  };

