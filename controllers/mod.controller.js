const db = require("../models");
const FoodHistory = db.foodhistory;
const User = db.user;


exports.getRegistroComidaDePacientePorFecha = (req, res) => {
    function checkDate(v) {
        var r = new Date(req.query.date);
        var rm = r.getMonth() - 1;
        var rd = r.getDate() + 1;
        var d = v
            .date
            .getFullYear() + "-" + v
            .date
            .getMonth() + "-" + v
            .date
            .getDate();
        var nr = r.getFullYear() + "-" + rm + "-" + rd;

        return d == nr;
    }

    FoodHistory.findOne({
        _id: req.query._id
    }, function (err, doc) {
        if (doc && req.query.date) {
            const date = doc
                .data
                .find(checkDate);
            return res
                .status(200)
                .send(date);
        }
        if (err) 
            return res
                .status(500)
                .send({error: err});

        }
    );
}

exports.insertarPesoPacienteEnHistorial = (req, res) => {
    var d = new Date();
    var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();

    User.findOneAndUpdate({
        _id: req.body._id
    }, {
        $push: {
            weight_history: {
                date: date,
                weight: req.body.weight
            }
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

exports.getHistorialPesoPaciente = (req, res) => {
    User.findOne({
        _id: req.query._id
    }, function (err, user) {
        var pesoMap = [];
        if (user) {
            user.weight_history.forEach(function (data) {

                    pesoMap.push(data);
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