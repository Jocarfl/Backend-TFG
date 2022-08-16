const db = require("../models");
const FoodHistory = db.foodhistory;
const User = db.user;

verifyOneFoodAtDay = (req, res, next) => {

    function checkDate(incomingData) {
        var todayDate = new Date();
        var todayDateDay = todayDate.getDate();
        var todayDateMonth = todayDate.getMonth() - 1;
        var todayDateYear = todayDate.getFullYear();

        var normIncomingData = incomingData.date.getFullYear() + "-" + incomingData.date.getMonth() + "-" + incomingData.date.getDate();
        var normTodayDate = todayDateYear + "-" + todayDateMonth + "-" + todayDateDay;

        return normIncomingData == normTodayDate;
    }


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
        const date = doc.data.find(checkDate);
        if(date){
            res.status(403).send("Solo se puede insertar una comida por dia");
            return;
        }
        else{
            next();
            return;
        }
        
      }
    
    });
  };


  module.exports = verifyOneFoodAtDay;