const db = require("../models");
const FoodHistory = db.foodhistory;
const User = db.user;

// GET REGISTRO COMIDA DE PACIENTE POR FECHA
exports.getRegistroComidaDePacientePorFecha = (req, res) => {

    // comprobar fecha
    function checkDate(v) {
        var r = new Date(req.query.date);
        var rm = r.getMonth() - 1;
        var rd = r.getDate() ;
        var d = v.date.getFullYear() + "-" + v.date.getMonth() + "-" + v.date.getDate();
        var nr = r.getFullYear() + "-" + rm + "-" + rd;


        return d == nr;
    }

    // buscar en Historial de comidas por id de usuario
    FoodHistory.findOne({
        _id: req.query._id
    }, function (err, doc) {
        if (doc && req.query.date) {
            // buscar registro que coincida con la fecha insertada
            const date = doc.data.find(checkDate);
            // enviar registro de comida   
            return res.status(200).send(date);
                
        }
        if (err) 
            return res
                .status(500)
                .send({error: err});

        }
    );
}

// INSERTAR PESO PACIENTE EN HISTORIAL
exports.insertarPesoPacienteEnHistorial = (req, res) => {
    var d = new Date();
    // normalizar fecha
    var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();

    // buscar y modificar usuario por id
    User.findOneAndUpdate({
        _id: req.body._id
    }, {
        $push: {
            // añadir fecha y peso al historial
            weight_history: {
                date: date,
                weight: req.body.weight
            }
        },
        $set: {
            // cambiar por el nuevo peso del usuario
            weight: req.body.weight
        }
    }, function (err, doc) {
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

// GET HISTORIAL PESO DEL PACIENTE
exports.getHistorialPesoPaciente = (req, res) => {
    //buscar usuario por id de usuario
    User.findOne({
        _id: req.query._id
    }, function (err, user) {
        var pesoMap = [];
        if (user) {
            // recorrer array del historial de peso
            user.weight_history.forEach(function (data) {
                    //añadir peso a nueva lista
                    pesoMap.push(data);
                });
        }
        if (err) 
            return res.status(500).send({error: err});
        if (!req.query._id) 
            return res.status(404).send("Id Not found.");
        return res
            .status(200)
            .send(pesoMap); // enviar lista de pesos
    });
}

exports.insertarRecomendacionPaciente = (req, res) => {
    var d = new Date();
    // normalizar fecha
    var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();

    // buscar y modificar usuario
    User.findOneAndUpdate({
        _id: req.body._id
    }, {
        $push: { 
            recomendations: { // insertar recomendación 
                date: date,
                title: req.body.title,
                description: req.body.description,
                completed: false
            }
        }
    }, function (err, doc) {
        if (err) return res.status(500).send({error: err});
        if (!doc) return res.status(404).send({message :'Id not found'});
        return res.status(200).send({message :'Succesfully saved.'});
    });
}

// GET RECOMENDACIONES DEL PACIENTE
exports.getRecomendacionesDelPaciente = (req, res) => {
    //buscar usuario por id
    User.findOne({
        _id: req.query._id
    }, function (err, user) {
        var recomendacionesMap = [];
        if (user) {
            // recorrer array recomendaciones
            user.recomendations.forEach(function (data) {
                // insertar recomendacion en nueva lista
                recomendacionesMap.push(data);
                });
        }
        if (err) return res.status(500).send({error: err});
        if (!req.query._id) return res.status(404).send("Id Not found.");
        // enviar lista de recomendaciones
        return res.status(200).send(recomendacionesMap);
    });
}

// GET PACIENTES VINCULADOS AL MODERADOR
exports.getPacientesVinculadosAlModerador = (req, res) => {
    // buscar usuarios que contengan el id del moderador recibido
    User.find({id_mod : req.query._id}, function(err, users) {
        var userMap = [];
        users.forEach(function(user) {
                // nueva lista
                userMap.push(user);         
        });
        if (err) return res.status(500).send({error: err});
        if (!req.query._id) return res.status(404).send("Id Not found.");
        // enviar lista de usuarios
        return res.status(200).send(userMap); 
      });
    }