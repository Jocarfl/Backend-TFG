const config = require("../config/auth.config");
const db = require("../models");
const Gamification = db.gamification;
const Retos = db.retos;


exports.crearSistemaGamificadoPorIdUsuario = (id) => {
    new Gamification({
      _id: id,
      level: 1,
      score:0,
      limit_score: 50,
      weekly_score:0,
    }).save(err => {
      if (err) {
        console.log("error", err);
      }
    });
  };

  function controladorDeNivelesGamificacion (userGamInfo){
    
    const niveles = 10;
    var puntuaciónLimiteInicial = 50;
    const factorPuntos = 1.5;

    for(i=1;i<niveles;i++){

        if(userGamInfo.level == i){
            var limitePuntos = puntuaciónLimiteInicial;
            if(userGamInfo.score >= limitePuntos){
                const puntosRestantes = userGamInfo.score - limitePuntos;
                Gamification.findOneAndUpdate({_id : userGamInfo._id},{
                    $inc: { level: 1 },
                    $set: { score: puntosRestantes , limit_score: limitePuntos * factorPuntos }
                }, function (err,doc) { });
            }
        }
        puntuaciónLimiteInicial = puntuaciónLimiteInicial * factorPuntos;
    }
  }

exports.sumarPuntuacionAUsuarioPorElemento = (req,res) => {
    const elementosGamificados = {
        nutricion:25,
        retos:5,
        recomendaciones:10,
        peso:15,
        }      

    function calcularPuntos() {
        if(req.body){    
            if(req.body.elemento == "nutricion") return elementosGamificados.nutricion;
            if(req.body.elemento == "retos") return elementosGamificados.retos;
            if(req.body.elemento == "recomendaciones") return elementosGamificados.recomendaciones;
            if(req.body.elemento == "peso") return elementosGamificados.peso;  
        }
    }

    Gamification.findOneAndUpdate( {_id:req.body._id},
        {
            $inc: { score: calcularPuntos() }
        },{new: true}, function(err,doc) {
        controladorDeNivelesGamificacion(doc);
        if (err) return res.status(500).send({error: err});
        if (!req.body._id) return res.status(404).send("Id Not found.");
        return res.status(200).send("Succesfull");
    });

}

exports.getInfoGamificacionPorId = (req,res) => {
    Gamification.findOne({_id : req.query._id}, function(err, doc) {
        if (err) return res.status(500).send({error: err});
        if (!req.query._id) return res.status(404).send("Id Not found.");
        return res.status(200).send(doc);  
    });
}

exports.getRetosDiariosSegunNivel = (req,res) => {
    Gamification.findOne({_id : req.query._id}, function(err, doc) {
        
        Retos.aggregate([
            {$match: {level: 1}},
            {$sample:{size:3}}
        ], function(err,doc) {
        if (err) return res.status(500).send({error: err});
        if (!doc) return res.status(404).send("Id Not found.");
        return res.status(200).send(doc); 
        })    
    });
}