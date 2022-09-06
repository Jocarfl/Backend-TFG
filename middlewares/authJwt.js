const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;


//VERIFICAR SI LA PETICIÓN VIENE CON TOKEN
verifyToken = (req, res, next) => {
  //recoge el token del header
  let token = req.headers["x-access-token"];
  if (!token) {
    //si no hay token se cancela petición
    return res.status(403).send({ message: "No se ha proporcionado ningun token!" });
  }
  //se verifica si el token es correcto comparandolo con la clave secreta
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      //si no es correcto se cancela petición
      return res.status(401).send({ message: "No autorizado!" });
    }
    //si es correcto se pasa el ID descodificado del usuario
    req.userId = decoded.id;
    next();
  });
};

// VERIFICAR QUE ES ADMINISTRADOR EL QUE HACE LA PETICIÓN
isAdmin = (req, res, next) => {
  // buscar usuario por id
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // buscar el rol que tiene el usuario
    Role.find(
      {
        _id: { $in: user.roles } // contiene rol
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          // si es admin continuar
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        // si no cancelar petición
        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

// VERIFICAR SI ES MODERADOR EL CLIENTE QUE HACE LA PETICIÓN
isModerator = (req, res, next) => {
  // buscar usuario por id
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // Buscar roles que contiene
    Role.find(
      {
        _id: { $in: user.roles } // si contiene rol
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          // si es moderador continuar
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }
        // si no es moderador cancelar petición
        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;