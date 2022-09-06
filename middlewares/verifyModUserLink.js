const db = require("../models");
const Role = db.role;
const User = db.user;

// VERIFICAR SI EL DNI ES DE UN ROL DE USUARIO
verifyUserRole = (req, res, next) => {

  // buscar usuario por dni
    User.findOne({dni: req.body.dni}).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        res.status(500).send({ message: "No existe el DNI" });
        return;
      }
      if(user){
        // buscar el rol que coniene
      Role.find(
        {
          _id: { $in: user.roles }
        },
        (err, roles) => {
          
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          for (let i = 0; i < roles.length; i++) {
            // si el dni es de un usuario continuar
            if (roles[i].name === "user") {
              next();
              return;
            }
          } 
          // si el dni no es de otro rol cancelar petición          
          res.status(403).send({ message: "Solo se puede vincular a usuarios" });
          return;
        }
      );
    }
    
    });
  };

  const verifyModUserLink = {
    verifyUserRole,
  };
  module.exports = verifyModUserLink;