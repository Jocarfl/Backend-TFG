const { user } = require("../models");
const db = require("../models");
const User = db.user;


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


exports.vincularUsuarioConMod = (req, res) => {

    User.findOneAndUpdate({dni: req.body.dni},{ $set:{
        id_mod : req.body.id_mod
    }}, function(err, doc) {
        if (err) return res.status(500).send({error: err});
        if (!doc) return res.status(404).send("User Not found.");
        return res.status(200).send('Succesfully saved.');
    });

}