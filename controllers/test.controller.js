const db = require("../models");
const User = db.user;
const Gamification = db.gamification;
const FoodHistories = db.foodhistory;


exports.borrarUsuarioPorNombreUsuario = async (req, res) => {
    if(req.body.username){
     User.findOne({username: req.body.username}, async function (err,user) {
        await Gamification.findOneAndDelete({_id: user._id}).exec();
        await FoodHistories.findOneAndDelete({_id: user._id}).exec();
        await User.findOneAndDelete({_id: user._id}).exec();

        return res.status(200).send("Usuario eliminado");
    });
    }else{
        return res.status(404).send("No se encuentra Usuario");
    }

}