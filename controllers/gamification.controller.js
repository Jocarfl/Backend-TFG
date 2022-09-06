const config = require("../config/auth.config");
const db = require("../models");
const Gamification = db.gamification;
const Retos = db.retos;
const Activity = db.activity;
const User = db.user;

// CREAR SISTEMA GAMIFICADO POR ID DE USUARIO
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

  // INSERTAR NUEVA ACTIVIDAD 
  function insertarNuevaActividad(actividad) {
    const nuevaActividad = new Activity({
        id_user: actividad._id,
        user: actividad.usuario,
        description: actividad.description
    });

    nuevaActividad.save();
    
  }

  // CONTROLADOR DE NIVELES GAMIFICACIÓN
  function controladorDeNivelesGamificacion (userGamInfo){
    
    // max de niveles
    const niveles = 10;
    // puntuación limite inicial para pasar de nivel
    var puntuaciónLimiteInicial = 50;
    // factor que aumentara los puntos para subir de nivel
    const factorPuntos = 1.5;

    for(i=1;i<niveles;i++){
        // realizar acción según nivel
        if(userGamInfo.level == i){
            var limitePuntos = puntuaciónLimiteInicial;
            // si los puntos han rebasado el limite significa que ha subido de nivel
            if(userGamInfo.score >= limitePuntos){
                //almacena los puntos restantes para que el usuario no los pierda
                const puntosRestantes = userGamInfo.score - limitePuntos;
                
                Gamification.findOneAndUpdate({_id : userGamInfo._id},{
                    $inc: { level: 1 }, // le incrementa 1 al nivel del usuario
                    $set: { score: puntosRestantes , limit_score: limitePuntos * factorPuntos } // le guarda los puntos restantes y multiplica el limite de puntos por el factor
                },{new: true}, function (err,doc) {

                        // inserta actividad 
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
        // según nivel multiplica por el factor para saber el limite
        puntuaciónLimiteInicial = puntuaciónLimiteInicial * factorPuntos;
    }
  }

// SUMAR PUNTUACION A USUARIO POR ELEMENTO
exports.sumarPuntuacionAUsuarioPorElemento = (req,res) => {
    // definir la puntuación según elemento
    const elementosGamificados = {
        nutricion:25,
        retos:5,
        recomendaciones:10,
        peso:15,
        }      

    // Calcualr puntos según elemento
    function calcularPuntos() {
        if(req.body){    
            if(req.body.elemento == "nutricion") return elementosGamificados.nutricion;
            if(req.body.elemento == "retos") return elementosGamificados.retos;
            if(req.body.elemento == "recomendaciones") return elementosGamificados.recomendaciones;
            if(req.body.elemento == "peso") return elementosGamificados.peso;  
        }
    }

    // buscar por id en Gamificacion
    Gamification.findOneAndUpdate( {_id:req.body._id},
        {    
            $inc: { score: calcularPuntos() , weekly_score: calcularPuntos() } //incrementar puntuación
        },{new: true}, function(err,doc) {
        controladorDeNivelesGamificacion(doc);
        if (err) return res.status(500).send({error: err});
        if (!req.body._id) return res.status(404).send("Id Not found.");
        return res.status(200).send("Succesfull");
    });

}

// GET INFORMACIÓN GAMIFICACIÓN POR ID
exports.getInfoGamificacionPorId = (req,res) => {
    // buscar en Gamification por id de usaurio
    Gamification.findOne({_id : req.query._id}, function(err, doc) {
        if (err) return res.status(500).send({error: err});
        if (!req.query._id) return res.status(404).send("Id Not found.");
        return res.status(200).send(doc);  
    });
}

// GET RETOS DIARIOS DEL USUARIO
exports.getRetosDiariosDelUsuario = (req,res) => {
    
    // insertar retos del dia segun el nivel de usuario
    function insertarRetosDelDiaSegunElNivelDeUsuario(id) {
        // buscar informacion gamificación por id
        Gamification.findOne({_id : id}, function(err,doc) {
            // sacar 3 retos aleatorios con el mismo nivel que el usuario
            Retos.aggregate([
                {$match: {level: doc.level}}, // mismo nivel
                {$sample:{size:3}} // 3 retos
            ], function(err,doc) {
                if(doc){
                    // insertar retos en Gamificación, con la fecha en la que se ha insertado
                    Gamification.findOneAndUpdate({_id : id}, {
                        $set: { retos_diarios: { lista_retos: doc, date : new Date()} }
                    }, function (err, doc1) {})
                }           
            }) 
            
        })
    }

    // comparar fecha de hoy con la fecha de los retos
    function compararFechaDeHoyConLaFechaDeLosRetos(incomingData) {
        var todayDate = new Date();
        var todayDateDay = todayDate.getDate();
        var todayDateMonth = todayDate.getMonth();
        var todayDateYear = todayDate.getFullYear();

        var normIncomingData = incomingData.getFullYear() + "-" + incomingData.getMonth() + "-" + incomingData.getDate();
        var normTodayDate = todayDateYear + "-" + todayDateMonth + "-" + todayDateDay;

        return normIncomingData == normTodayDate;
    }

    // buscar informacion gamificada por id
    Gamification.findOne({_id : req.query._id}, function(err, doc) {
        if(doc){
            //comparar fecha
            const date = compararFechaDeHoyConLaFechaDeLosRetos(doc.retos_diarios.date);
            // si la fecha no coincide a la de hoy, insertar nuevos retos diarios
            if(doc.retos_diarios.lista_retos.length <= 0 || !date){
                //insertar nuevos retos si es otro dia
                insertarRetosDelDiaSegunElNivelDeUsuario(req.query._id);
                return res.status(200).send(doc.retos_diarios.lista_retos);
            }
            return res.status(200).send(doc.retos_diarios.lista_retos);
        }   
    });
}

//MARCAR RETO COMO COMPLETADO
exports.marcarRetoComoCompletado = (req, res) => {
    // buscar Gamificacion por Id de usuario y por Id del reto
    Gamification.findOneAndUpdate({
        _id: req.body._id,
        "retos_diarios.lista_retos._id": req.body.idReto
    }, {
        $set: {
          "retos_diarios.lista_retos.$.completed":true // marcar reto como completado
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

// GET ACTIVIDADES RECIENTES
exports.getActividadesRecientes = (req,res) => {
    // get 4 actividades por orden descendente de id
    Activity.find({}).sort({_id:"desc"}).limit(4).exec(function(err,doc) {
        var actividadesMap = [];

            if(doc){       
                doc.forEach(function (data) {
                    
                        actividadesMap.push(data);                       
                      
                  });   
            }
            if (err) return res.status(500).send({error: err});
            if (!doc) return res.status(404).send("No activity");
            //devolver array con 4 actividades
            return res.status(200).send(actividadesMap); 
    });
}

// GET CLASIFICACION POR PUNTOS
exports.getClasificacionPorPuntos = (req,res) =>{
    //buscar todos los usuarios con puntuación semanal más alta, limitando a 4 documentos
    Gamification.find({}).sort({weekly_score : "asc"}).limit(4).populate('_id').exec(function(err,doc){
        var clasiMap = [];
            var count = 5;
            if(doc){ 
                doc.forEach(function (data) {       
                        
                        // información del array 
                        const newData = {
                            clasi : count -1, // posición en la clasificación
                            weekly_score : data.weekly_score, // puntuación semanal
                            user: data._id.username // nombre de usuario
                        }

                        clasiMap.unshift(newData);                    
                        count--;
                  });   
            }
            if (err) return res.status(500).send({error: err});
            if (!doc) return res.status(404).send("No users");

            // enviar array
            return res.status(200).send(clasiMap); 
    });
}