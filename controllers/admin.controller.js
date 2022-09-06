const { query } = require("express");
const { user } = require("../models");
const db = require("../models");
const User = db.user;
const Role = db.role;

//GET TODOS LOS MODERADORES
exports.getAllModerators = (req, res) => {
    //buscar todos lo usuarios
    User.find({}, function(err, users) {
        var userMap = [];
        if(users){
            //buscar el rol que cumple el usuario
            Role.findOne({name:"moderator"}, function (err, role) {    
                const rol = role._id;         
                users.forEach(function(user) {
                    //si el rol equivale a moderador se introduce en el array
                    if(user.roles[0].toString() == rol.toString()) //Id del rol moderador
                    {                                
                        userMap.push(user);
                    }                   
                }); 
            // si hay error devuelve error
            if (err) return res.send(500, {error: err});
            // devuelve array
            return res.status(200).send(userMap);               
        });
        }
        
      });
}

// GET TODOS LOS PACIENTES VINCULADOS AL MÉDICO
exports.getPacientesVinculadosAlModerador = (req, res) => {
    //se busca usuarios con el mismo ID recibido en el cuerpo
    User.find({id_mod : req.query._id}, function(err, users) {
        if(users){
            // si se encuentran se añaden todos a una lista
            var userMap = [];
            users.forEach(function(user) {
                    userMap.push(user);         
            });
            //se devuelve la lista
            return res.status(200).send(userMap);
        }
        //si hay error se devuelve el error
        if (err) return res.status(500).send({error: err});
        //si no se recibe ID devuelve mensaje
        if (!req.query._id) return res.status(404).send({ message: "No se ha recibido el ID" });
        //si no se encuentran usuarios devuelve mensaje
        if (!users) return res.status(404).send({ message: "No se han ecnontrado pacientes" });
          
      });
    }

// VINCULAR USUARIO CON MODERADOR
exports.vincularUsuarioConMod = (req, res) => {
    // buscar en User por dni
    User.findOneAndUpdate({dni: req.body.dni},{ $set:{
        // insertar id del moderador
        id_mod : req.body.id_mod
    }}, function(err, doc) {
        if (err) return res.status(500).send({error: err}); 
        if (!doc) return res.status(404).send({ message: "User not found" });
        if(doc) return res.status(200).send({ message: "Vinculado con éxito" });
             
    });
}