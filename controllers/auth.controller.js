const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const food = require("./user.controller");
const gamification = require("./gamification.controller");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// REGISTRAR USUARIO
exports.signup = (req, res) => {
  // Calcualr rango de peso ideal
  function calculoRangoPesoIdeal(altura,genero) {
    if(genero == "masculino"){
      //formula masculino
      var pesoIdeal = ((((altura-152)*2.2)/2.45)+50);

      var pesoIdealMin = Math.abs(((pesoIdeal*0.1)-pesoIdeal));
      var pesoIdealMax = Math.abs(((pesoIdeal*0.1)+pesoIdeal));

      const rangoPeso = {max: pesoIdealMax, min: pesoIdealMin}

      return rangoPeso;

    }

    if(genero == "femenino"){
      //fromula femenino
      pesoIdeal = ((((altura-152)*2.2)/2.45)+45);

      var pesoIdealMin = Math.abs(((pesoIdeal*0.1)-pesoIdeal));
      var pesoIdealMax = Math.abs(((pesoIdeal*0.1)+pesoIdeal));

      const rangoPeso = {max: pesoIdealMax, min: pesoIdealMin}

      return rangoPeso;
    }
  }

  // definir el usuario
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

  // insertar el usuario en la base de datos
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // si contiene rol buscar cual
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
          // cambiar por id del rol
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
      // si es rol usuario
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        // cambiar por id de rol
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
    //crear registro de comida por id
    food.crearRegistroComidaPorId(user._id);
    //crear información gamificada por id
    gamification.crearSistemaGamificadoPorIdUsuario(user._id);
  });
};

//INICIAR SESIÓN
exports.signin = (req, res) => {
  //buscar por nombre de usuario
  User.findOne({
    username: req.body.username
  })
    // esto permite leer el documento referenciado por id
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      // comparar contraseña insertada con la contraseña encriptada de la base ded atos
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
      // crear token junto al id de usuario y la clave secreta
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 horas
      });
      // extraer nombre del rol
      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      //enviar datos de sesión
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        gender: user.gender,
        user_name: user.first_name +" "+ user.second_name ,
        accessToken: token, //token jwt 24h de sesión
        ideal_weight: {
          min:user.ideal_weight.min,
          max:user.ideal_weight.max
        }
      });
    });
};