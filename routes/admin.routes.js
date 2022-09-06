const { verifyModUserLink,authJwt } = require("../middlewares");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {

  //ENCABEZADO
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  

  /*
  -----------------------------
  -COMENTAR PARA TESTS---------
  ----------------------------- 
  */

 // GET TODOS LOS MODERADORES 
 app.get("/api/admin/getAllModerators", [authJwt.verifyToken,authJwt.isAdmin], controller.getAllModerators);

 // POST VINCULAR USUARIOS CON MODERADOR 
 app.post("/api/admin/vincularUsuarioConMod",[verifyModUserLink.verifyUserRole,authJwt.verifyToken,authJwt.isAdmin] , controller.vincularUsuarioConMod);

// GET PACIENTES VINCULADOS AL MODERADOR
 app.get("/api/admin/getPacientesVinculadosAlModerador",[authJwt.verifyToken,authJwt.isAdmin], controller.getPacientesVinculadosAlModerador);



 /*
 -----------------------------
 -DESCOMENTAR PARA TESTS------
 -----------------------------
  app.get("/api/admin/getAllModerators", controller.getAllModerators);

  app.post("/api/admin/vincularUsuarioConMod",[verifyModUserLink.verifyUserRole] , controller.vincularUsuarioConMod);

  app.get("/api/admin/getPacientesVinculadosAlModerador", controller.getPacientesVinculadosAlModerador);

  */
  
};