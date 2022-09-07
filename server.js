const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const retosDB = require("./resources/retos_diarios.json");
const comidaDB = require("./resources/ComidaBD.json");
var bcrypt = require("bcryptjs");

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
const User = db.user;

// conectar a la BD
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

// declarar las rutas
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/admin.routes')(app);
require('./routes/mod.routes')(app);
require('./routes/test.routes')(app);

// Abrir puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


// crear Admin por defecto 
function crearUsuarioPorDefecto(id){
  const user = new User({
    username: "admin",
    email: "adminNEW@hotmail.com",
    password: bcrypt.hashSync("admin", 8),
    first_name: "Admin",
    dni: "44565582T",
    born_date: "03/02/1999",
    gender: "masculino",
    height : 188,
    roles:[id],
  })
 
   User.estimatedDocumentCount((err,count) =>{
    if(!err && count==0){
       user.save((err,result) => {
        if (err) {
          console.log("error", err);
        }
        console.log("Añadido usuario por defecto admin");
      });
  }
  });
}



function initial() {

  // Añadir retos diarios
      Retos.estimatedDocumentCount((err,count) =>{
      if(!err && count==0){
        Retos.insertMany(retosDB);
        console.log("Added Daily Challenges")
      }
    });

    // Añadir alimentos BEDCA
      Food.estimatedDocumentCount((err,count) =>{
      if(!err && count==0){
        Food.insertMany(comidaDB);
        console.log("Food Data Base")
      }
    });

     // Añadir roles
  Role.estimatedDocumentCount((err, count) => {
  if (!err && count === 0) {
     const user = new Role({name:"user"});
    const mod = new Role({name:"moderator"});
    const admin = new Role({name:"admin"});

    user.save((err,result) => {
      if (err) {
        console.log("error", err);
      }
      console.log("added 'user' to roles collection");
    });
    mod.save((err,result) => {
      if (err) {
        console.log("error", err);
      }
      console.log("added 'moderator' to roles collection");
    });

    admin.save((err,result) => {
      if (err) {
        console.log("error", err);
      }
      if(result){
      console.log("added 'admin' to roles collection");
      crearUsuarioPorDefecto(result._id);
      }
    });
  }
})
}

  module.exports = app;