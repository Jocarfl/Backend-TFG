const { user } = require("../models");
const db = require("../models");
const FoodHistory = db.foodhistory;
const Role = db.role;

/*
exports.getRegistroComidaDePacientePorFecha = (req, res) => {
    FoodHistory.find({_id : req.body._id,
                    'data.date' : req.body.date 
    }, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.send(doc);  
      });
}*/

exports.getRegistroComidaDePacientePorFecha = (req, res) => {
    function checkDate(v){
        var r = new Date(req.query.date);
        var rm = r.getMonth()-1;
        var rd = r.getDate()+1;
        var d = v.date.getFullYear()+ "-" + v.date.getMonth() + "-" + v.date.getDate();
        var nr = r.getFullYear()+ "-" + rm + "-" + rd;
        
        return d == nr;
    }

    FoodHistory.findOne({_id : req.query._id}, function(err, doc) {  
        if(doc && req.query.date){ 
        const date = doc.data.find(checkDate);
          return res.status(200).send(date);      
        }
        if (err) return res.status(500).send({error: err});
          
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