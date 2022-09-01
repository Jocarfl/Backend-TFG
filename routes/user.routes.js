const { authJwt,verifyOneFoodAtDay } = require("../middlewares");
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


  /*
  -----------------------------
  -COMENTAR PARA TESTS---------
  ----------------------------- 
  */
  app.get("/api/user/getRecomendacionesDelPaciente",[authJwt.verifyToken], controller.getRecomendacionesDelPacientePorCompletados);

  app.get("/api/user/getInfoGamificacionPorId",[authJwt.verifyToken], gamification.getInfoGamificacionPorId);

  app.get("/api/user/getUltimosPesosUsuario",[authJwt.verifyToken], controller.getUltimosPesosUsuarioYRangoPesoIdeal);

  app.get("/api/user/getClasificacionPorPuntos",[authJwt.verifyToken], gamification.getClasificacionPorPuntos);

  app.get("/api/user/getActividadesRecientes",[authJwt.verifyToken], gamification.getActividadesRecientes);

  app.get("/api/user/getRetosDiariosDelUsuario",[authJwt.verifyToken], gamification.getRetosDiariosDelUsuario);

  app.get("/api/user/getAllFood",[authJwt.verifyToken], controller.getAllFood);


  app.post("/api/user/marcarRecomendacionComoCompletada",[authJwt.verifyToken], controller.marcarRecomendacionComoCompletada);
  
  app.post("/api/user/sumarPuntuacionAUsuarioPorElemento",[authJwt.verifyToken], gamification.sumarPuntuacionAUsuarioPorElemento);

  app.post("/api/user/insertFoodRegistration", [verifyOneFoodAtDay,authJwt.verifyToken] , controller.insertarComidaDiariaPorId);

  app.post("/api/user/marcarRetoComoCompletado",[authJwt.verifyToken], gamification.marcarRetoComoCompletado);



  /*
 -----------------------------
 -DESCOMENTAR PARA TESTS------
 -----------------------------

  app.get("/api/user/getRecomendacionesDelPaciente", controller.getRecomendacionesDelPacientePorCompletados);

  app.get("/api/user/getInfoGamificacionPorId", gamification.getInfoGamificacionPorId);

  app.get("/api/user/getUltimosPesosUsuario", controller.getUltimosPesosUsuarioYRangoPesoIdeal);

  app.get("/api/user/getClasificacionPorPuntos", gamification.getClasificacionPorPuntos);

  app.get("/api/user/getActividadesRecientes", gamification.getActividadesRecientes);

  app.get("/api/user/getRetosDiariosDelUsuario", gamification.getRetosDiariosDelUsuario);

  app.get("/api/user/getAllFood", controller.getAllFood);


  app.post("/api/user/marcarRecomendacionComoCompletada", controller.marcarRecomendacionComoCompletada);
  
  app.post("/api/user/sumarPuntuacionAUsuarioPorElemento", gamification.sumarPuntuacionAUsuarioPorElemento);

  app.post("/api/user/insertFoodRegistration", [verifyOneFoodAtDay] , controller.insertarComidaDiariaPorId);

  app.post("/api/user/marcarRetoComoCompletado", gamification.marcarRetoComoCompletado);
  
  */

  
};