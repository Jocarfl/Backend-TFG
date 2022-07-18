const { user } = require("../models");
const db = require("../models");
const User = db.user;
const Role = db.role;


exports.getAllModerators = (req, res) => {
    User.find({}, function(err, users) {
        var userMap = [];

        users.forEach(function(user) {
            if(user.roles == "62b8ab283bfd083a48f45c7b") //Id del rol moderador
            {
                userMap.push(user);
            }          
        });
        if (err) return res.send(500, {error: err});
        return res.send(userMap);  
      });
}

exports.getPacientesVinculadosAlModerador = (req, res) => {
    User.find({id_mod : req.query._id}, function(err, users) {
        var userMap = [];
        users.forEach(function(user) {
                userMap.push(user);         
        });
        if (err) return res.status(500).send({error: err});
        if (!req.query._id) return res.status(404).send("Id Not found.");
        return res.status(200).send(userMap);  
      });
    }


exports.vincularUsuarioConMod = (req, res) => {
    User.findOneAndUpdate({dni: req.body.dni},{ $set:{
        id_mod : req.body.id_mod
    }}, function(err, doc) {
        if (err) return res.status(500).send({error: err});
        if (!doc) return res.status(404).send("User Not found.");
        if(doc.roles == "62b8ab283bfd083a48f45c7b" || "62b8ab283bfd083a48f45c7c") return res.status(403).send("Only can vinculate on User");
        return res.status(200).send('Succesfully saved.');
    });

}