const db = require("../models");
const User = db.user;


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

exports.getUltimosPesosUsuario = (req, res) => {
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
            }
      if (err) 
          return res.status(500).send({error: err});
      if (!req.query._id) 
          return res.status(404).send("Id Not found.");
      return res
          .status(200)
          .send(pesoMap);
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