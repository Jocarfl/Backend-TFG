const db = require("../models");
const Role = db.role;
const User = db.user;

verifyUserRole = (req, res, next) => {
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
            if (roles[i].name === "user") {
              next();
              return;
            }
          }           
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