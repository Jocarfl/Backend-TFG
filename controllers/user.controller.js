const db = require("../models");
const User = db.user;
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


exports.getRecomendacionesDelPacientePorCompletados = (req, res) => {
  User.findOne({
      _id: req.query._id
  }, function (err, user) {
      var recomendacionesMap = [];
      if (user) {
          user.recomendations.forEach(function (data) {
              if(data.completed != true){                
                recomendacionesMap.unshift(data);
              }else{
                recomendacionesMap.push(data);
              }         
              });
      }
      if (err) return res.status(500).send({error: err});
      if (!req.query._id) return res.status(404).send("Id Not found.");
      return res.status(200).send(recomendacionesMap);
  });
}

exports.getUltimosPesosUsuarioYRangoPesoIdeal = (req, res) => {
  User.findOne({
      _id: req.query._id
  }, function (err, user) {
      var pesoMap = [];
      var count = 0;
      if (user) {
          user.weight_history.reverse().forEach(function (data) {
                if(count<7){
                    pesoMap.unshift(data);
                }    
                  count++;
              });

              const data = {listaPesos: pesoMap, rangoPesoIdeal: user.ideal_weight }

              
              return res.status(200).send(data);
            }
      if (err) 
          return res.status(500).send({error: err});
      if (!req.query._id) 
          return res.status(404).send("Id Not found.");
      
  });
}


exports.marcarRecomendacionComoCompletada = (req, res) => {

  User.findOneAndUpdate({
      _id: req.body._id,
      "recomendations._id": req.body.idRec
  }, {
      $set: {
        "recomendations.$.completed":true
       }}
       , function (err, doc) {
      if (err) 
          return res
              .status(500)
              .send(err);
      if (!doc) 
          return res
              .status(404)
              .send("Id Not found.");
      return res
          .status(200)
          .send({message :'Succesfully saved.'});
  });
}