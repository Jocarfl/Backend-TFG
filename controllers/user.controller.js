const db = require("../models");
const User = db.user;
const FoodHistory = db.foodhistory;
const Food = db.food;

// CREAR REGISTRO DE COMIDA POR ID DE USUARIO
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

// INSERTAR COMIDA DIARIA POR ID
exports.insertarComidaDiariaPorId = (req,res) => {

  var d = new Date();
  var date = d.getFullYear()+ "-" + d.getMonth() + "-" + d.getDate();

// buscar registro de comida por id         insertar comidas con fecha 
FoodHistory.findByIdAndUpdate(req.body.id, {$push: {data: {date : date , comidas : req.body.comidas}}},
  function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) return res.status(404).send("Id Not found.");
    return res.status(200).send('Succesfully saved.');});
  };

// GET RECOMENDACIONES DEL PACIENTE ORDENADOS POR COMPLETADOS
exports.getRecomendacionesDelPacientePorCompletados = (req, res) => {
  User.findOne({
      _id: req.query._id
  }, function (err, user) {
      var recomendacionesMap = [];
      if (user) {
        //recorrer lista de recomendaciones
          user.recomendations.forEach(function (data) {
              // si no esta completado se añade al final
              if(data.completed != true){                
                recomendacionesMap.unshift(data);
              }else{
                // si esta completado se añade al principio 
                recomendacionesMap.push(data);
              }         
              });
      }
      if (err) return res.status(500).send({error: err});
      if (!req.query._id) return res.status(404).send("Id Not found.");
      // enviar lista recomendaciones
      return res.status(200).send(recomendacionesMap);
  });
}

// GET ULTIMOS PESOS USUARIO Y RANGO PESO IDEAL
exports.getUltimosPesosUsuarioYRangoPesoIdeal = (req, res) => {
  User.findOne({
      _id: req.query._id
  }, function (err, user) {
      var pesoMap = [];
      var count = 0;
      if (user) {
        // recorrer lista de pesos al reves
          user.weight_history.reverse().forEach(function (data) {
                if(count<7){
                  // añadir peso a la lista
                    pesoMap.unshift(data);
                }    
                  count++;
              });
              // añadir rango ideal de peso 
              const data = {listaPesos: pesoMap, rangoPesoIdeal: user.ideal_weight }

              // enviar todos los datos
              return res.status(200).send(data);
            }
      if (err) 
          return res.status(500).send({error: err});
      if (!req.query._id) 
          return res.status(404).send("Id Not found.");
      
  });
}

// MARCAR RECOMENDACION POR COMPLETADA
exports.marcarRecomendacionComoCompletada = (req, res) => {

  // buscar usuario por id y recomendación por id
  User.findOneAndUpdate({
      _id: req.body._id,
      "recomendations._id": req.body.idRec
  }, {
      $set: {
        "recomendations.$.completed":true // poner como completado la recomendacion
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

// GET TODAS LOS ALIMENTOS
exports.getAllFood = (req, res) => {
  Food.find({}, function(err, doc) {
      var foodMap = [];
      //recorre la lista y añade todos los alimentos en una nueva lista
      doc.forEach(function(food) {
            foodMap.push(food);       
      });
      if (err) return res.send(500, {error: err});
      // devuelve la lista
      return res.status(200).send(foodMap);  
    });
}