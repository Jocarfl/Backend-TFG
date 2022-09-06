const db = require("../models");
const FoodHistory = db.foodhistory;
const User = db.user;

// VERIFICAR EL REGISTRO DE UNA COMIDA POR DIA 
verifyOneFoodAtDay = (req, res, next) => {
    // comprobar fecha
    function checkDate(incomingData) {
        var todayDate = new Date();
        var todayDateDay = todayDate.getDate();
        var todayDateMonth = todayDate.getMonth() - 1;
        var todayDateYear = todayDate.getFullYear();

        var normIncomingData = incomingData.date.getFullYear() + "-" + incomingData.date.getMonth() + "-" + incomingData.date.getDate();
        var normTodayDate = todayDateYear + "-" + todayDateMonth + "-" + todayDateDay;

        return normIncomingData == normTodayDate;
    }

    // buscar registro de comida por id de usuario
    FoodHistory.findOne({_id: req.body.id}).exec((err, doc) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (!doc) {
        res.status(500).send("No existen registros" );
        return;
      }

      if(doc){
        // si se encuentra un registro con la misma fecha cancelar petición
        const date = doc.data.find(checkDate);
        if(date){
            res.status(403).send("Solo se puede insertar una comida por dia");
            return;
        }
        else{
          // si no existe la fecha continuar
            next();
            return;
        }    
      }
    
    });
  };


  module.exports = verifyOneFoodAtDay;