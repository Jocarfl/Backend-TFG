const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const gamification = require("../controllers/gamification.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
 /* app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );*/

  app.get("/api/user/getRecomendacionesDelPaciente", controller.getRecomendacionesDelPacientePorCompletados);

  app.post("/api/user/marcarRecomendacionComoCompletada", controller.marcarRecomendacionComoCompletada);
  
  app.post("/api/user/sumarPuntuacionAUsuarioPorElemento", gamification.sumarPuntuacionAUsuarioPorElemento);

  app.get("/api/user/getInfoGamificacionPorId", gamification.getInfoGamificacionPorId);
};