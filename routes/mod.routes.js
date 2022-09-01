const { authJwt } = require("../middlewares");
const controller = require("../controllers/mod.controller");

module.exports = function(app) {
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
  app.get("/api/mod/getRegistroComidaDePacientePorFecha",[authJwt.verifyToken, authJwt.isModerator], controller.getRegistroComidaDePacientePorFecha);

  app.post("/api/mod/insertarPesoPacienteEnHistorial",[authJwt.verifyToken, authJwt.isModerator], controller.insertarPesoPacienteEnHistorial);

  app.post("/api/mod/insertarRecomendacionPaciente",[authJwt.verifyToken, authJwt.isModerator], controller.insertarRecomendacionPaciente);

  app.get("/api/mod/getHistorialPesoPaciente",[authJwt.verifyToken, authJwt.isModerator], controller.getHistorialPesoPaciente);

  app.get("/api/mod/getRecomendacionesDelPaciente",[authJwt.verifyToken, authJwt.isModerator], controller.getRecomendacionesDelPaciente);

  app.get("/api/mod/getPacientesVinculadosAlModerador",[authJwt.verifyToken,authJwt.isModerator], controller.getPacientesVinculadosAlModerador);


  /*
 -----------------------------
 -DESCOMENTAR PARA TESTS------
 -----------------------------

  app.get("/api/mod/getRegistroComidaDePacientePorFecha", controller.getRegistroComidaDePacientePorFecha);

  app.post("/api/mod/insertarPesoPacienteEnHistorial", controller.insertarPesoPacienteEnHistorial);

  app.post("/api/mod/insertarRecomendacionPaciente", controller.insertarRecomendacionPaciente);

  app.get("/api/mod/getHistorialPesoPaciente", controller.getHistorialPesoPaciente);

  app.get("/api/mod/getRecomendacionesDelPaciente", controller.getRecomendacionesDelPaciente);
  
  app.get("/api/mod/getPacientesVinculadosAlModerador", controller.getPacientesVinculadosAlModerador);
  
  */


};