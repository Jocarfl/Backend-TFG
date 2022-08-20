const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require("./user.model");
db.role = require("./role.model");
db.foodhistory = require("./food-history.model");
db.gamification = require("./gamification.model");
db.retos = require("./retos-diarios.model");
db.food = require("./food.model");
db.activity = require("./activity.model");
db.ROLES = ["user", "moderator", "admin"];
module.exports = db;