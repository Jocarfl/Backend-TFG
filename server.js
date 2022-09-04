const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const retosDB = require("./resources/retos_diarios.json");
const comidaDB = require("./resources/ComidaBD.json");

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
const Retos = db.retos;
const Food = db.food;

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
    initial();
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido" });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/admin.routes')(app);
require('./routes/mod.routes')(app);
require('./routes/test.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {

    Retos.estimatedDocumentCount((err,count) =>{
      if(!err && count==0){
        Retos.insertMany(retosDB);
        console.log("Added Daily Challenges")
      }
    });

    Food.estimatedDocumentCount((err,count) =>{
      if(!err && count==0){
        Food.insertMany(comidaDB);
        console.log("Food Data Base")
      }
    });


    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'user' to roles collection");
        });
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'moderator' to roles collection");
        });
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'admin' to roles collection");
        });
      }
    });  
  }

  module.exports = app;