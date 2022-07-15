const db = require("../models");
const User = db.user;


exports.getAllModerators = (req, res) => {

    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
            if(user.roles == "62b8ab283bfd083a48f45c7b"){
                userMap[user._id] = user;
            }          
        });
    
        res.send(userMap);  
      });


}