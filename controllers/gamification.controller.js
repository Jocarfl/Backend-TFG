const config = require("../config/auth.config");
const db = require("../models");
const Gamification = db.gamification;
const Retos = db.retos;
const Activity = db.activity;
const User = db.user;

exports.crearSistemaGamificadoPorIdUsuario = (id) => {
    new Gamification({
      _id: id,
      level: 1,
      score:0,
      retos_diarios:{
        lista_retos : [],
        date : new Date()
      },
      limit_score: 50,
      weekly_score:0,
    }).save(err => {
      if (err) {
        console.log("error", err);
      }
    });
  };

  function insertarNuevaActividad(actividad) {
    const nuevaActividad = new Activity({
        id_user: actividad._id,
        user: actividad.usuario,
        description: actividad.description
    });

    nuevaActividad.save();
    
  }

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
                },{new: true}, function (err,doc) {
                    
                        User.findOne({_id: userGamInfo._id }, function (err,user) {
                            const nivel = userGamInfo.level+1;
                        const actividad = {
                            _id: userGamInfo._id,
                            usuario: user.first_name+" "+user.second_name,
                            description: user.first_name+ " ha subido a nivel "+nivel+". A que esperas?"
                        }

                        insertarNuevaActividad(actividad);

                    })

                 });
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
            $inc: { score: calcularPuntos() , weekly_score: calcularPuntos() }
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

exports.getRetosDiariosDelUsuario = (req,res) => {
    
    function insertarRetosDelDiaSegunElNivelDeUsuario(id) {
        Gamification.findOne({_id : id}, function(err,doc) {
            Retos.aggregate([
                {$match: {level: 1}},
                {$sample:{size:3}}
            ], function(err,doc) {
                if(doc){
                    Gamification.findOneAndUpdate({_id : id}, {
                        $set: { retos_diarios: { lista_retos: doc, date : new Date()} }
                    }, function (err, doc1) {})
                }           
            }) 
            
        })
    }

    function compararFechaDeHoyConLaFechaDeLosRetos(incomingData) {
        var todayDate = new Date();
        var todayDateDay = todayDate.getDate();
        var todayDateMonth = todayDate.getMonth();
        var todayDateYear = todayDate.getFullYear();

        var normIncomingData = incomingData.getFullYear() + "-" + incomingData.getMonth() + "-" + incomingData.getDate();
        var normTodayDate = todayDateYear + "-" + todayDateMonth + "-" + todayDateDay;

        return normIncomingData == normTodayDate;
    }

    
    Gamification.findOne({_id : req.query._id}, function(err, doc) {
        if(doc){
            const date = compararFechaDeHoyConLaFechaDeLosRetos(doc.retos_diarios.date);
            if(doc.retos_diarios.lista_retos.length <= 0 || !date){
                insertarRetosDelDiaSegunElNivelDeUsuario(req.query._id);
                return res.status(200).send(doc.retos_diarios.lista_retos);
            }
            return res.status(200).send(doc.retos_diarios.lista_retos);
        }   
    });
}

exports.marcarRetoComoCompletado = (req, res) => {

    Gamification.findOneAndUpdate({
        _id: req.body._id,
        "retos_diarios.lista_retos._id": req.body.idReto
    }, {
        $set: {
          "retos_diarios.lista_retos.$.completed":true
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


exports.getActividadesRecientes = (req,res) => {
    Activity.find({}).sort({_id:"desc"}).limit(4).exec(function(err,doc) {
        var actividadesMap = [];

            if(doc){       
                doc.forEach(function (data) {
                    
                        actividadesMap.push(data);                       
                      
                  });   
            }
            if (err) return res.status(500).send({error: err});
            if (!doc) return res.status(404).send("No activity");
            return res.status(200).send(actividadesMap); 
    });
}


exports.getClasificacionPorPuntos = (req,res) =>{
    Gamification.find({}).sort({weekly_score : "asc"}).limit(4).populate('_id').exec(function(err,doc){
        var clasiMap = [];
            var count = 5;
            if(doc){ 
                doc.forEach(function (data) {       
                                               
                        const newData = {
                            clasi : count -1,
                            weekly_score : data.weekly_score,
                            user: data._id.username
                        }

                        clasiMap.unshift(newData);                    
                        count--;
                  });   
            }
            if (err) return res.status(500).send({error: err});
            if (!doc) return res.status(404).send("No users");
            return res.status(200).send(clasiMap); 
    });
}