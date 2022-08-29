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

 // app.get("/api/admin/getAllModerators", [authJwt.verifyToken, authJwt.isModerator], controller.getAllModerators);

  app.get("/api/mod/getRegistroComidaDePacientePorFecha", controller.getRegistroComidaDePacientePorFecha);

  app.post("/api/mod/insertarPesoPacienteEnHistorial", controller.insertarPesoPacienteEnHistorial);

  app.post("/api/mod/insertarRecomendacionPaciente", controller.insertarRecomendacionPaciente);

  app.get("/api/mod/getHistorialPesoPaciente", controller.getHistorialPesoPaciente);

  app.get("/api/mod/getRecomendacionesDelPaciente", controller.getRecomendacionesDelPaciente);


};