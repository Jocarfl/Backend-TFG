const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

// VERIFICAR SI EL NOMBRE DE USUARIO Y EL EMAIL YA EXISTEN
checkDuplicateUsernameOrEmail = (req, res, next) => {
  // buscar nombre de usuario
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      // si se encuentra cancelar petición
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
    // buscar email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        // si se encuentra cancelar petición 
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
  });
};

// VERIFICAR SI EL DNI YA EXISTE
checkDuplicateDNI = (req,res,next)=>{
  // buscar usuario por dni
  User.findOne({
    dni: req.body.dni
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      // si existe cancelar petición 
      res.status(400).send({ message: "Failed! DNI is already in use!" });
      return;
    }
    next();
  });
 
}

// VERIFICAR QUE CONTIENE UN ROL QUE EXISTE EN LA BASE DE DATOS
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        // si no se encuentra un rol que coincida se cancela petición
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }
  next();
};
const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  checkDuplicateDNI
};
module.exports = verifySignUp;