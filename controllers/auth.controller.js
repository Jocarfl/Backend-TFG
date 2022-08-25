const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const FoodHistory = db.foodhistory;
const Role = db.role;
const food = require("./food.controller");
const gamification = require("./gamification.controller");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

  function calculoRangoPesoIdeal(altura,genero) {
    if(genero == "masculino"){
      var pesoIdeal = ((((altura-152)*2.2)/2.45)+50);

      var pesoIdealMin = Math.abs(((pesoIdeal*0.1)-pesoIdeal));
      var pesoIdealMax = Math.abs(((pesoIdeal*0.1)+pesoIdeal));

      const rangoPeso = {max: pesoIdealMax, min: pesoIdealMin}

      return rangoPeso;

    }

    if(genero == "femenino"){
      pesoIdeal = ((((altura-152)*2.2)/2.45)+45);

      var pesoIdealMin = Math.abs(((pesoIdeal*0.1)-pesoIdeal));
      var pesoIdealMax = Math.abs(((pesoIdeal*0.1)+pesoIdeal));

      const rangoPeso = {max: pesoIdealMax, min: pesoIdealMin}

      return rangoPeso;
    }
  }

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    first_name: req.body.first_name,
    second_name: req.body.second_name,
    dni: req.body.dni,
    born_date: req.body.born_date,
    gender: req.body.gender,
    height : req.body.height,
    ideal_weight: {
      min: calculoRangoPesoIdeal(req.body.height,req.body.gender).min,
      max: calculoRangoPesoIdeal(req.body.height,req.body.gender).max
    }
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }         
          res.send({ message: "User was registered successfully!" });
        });
      });
    }
    food.crearRegistroComidaPorId(user._id);
    gamification.crearSistemaGamificadoPorIdUsuario(user._id);
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password  
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        gender: user.gender,
        accessToken: token
      });
    });
};