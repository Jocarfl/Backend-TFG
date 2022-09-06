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

  // GET RECOMENDACIONES DEL PACIENTE
  app.get("/api/user/getRecomendacionesDelPaciente",[authJwt.verifyToken], controller.getRecomendacionesDelPacientePorCompletados);

  // GET INFORMACION GAMIFICACION POR ID
  app.get("/api/user/getInfoGamificacionPorId",[authJwt.verifyToken], gamification.getInfoGamificacionPorId);
// GET ULTIMOS PESOS DEL USUARIO
  app.get("/api/user/getUltimosPesosUsuario",[authJwt.verifyToken], controller.getUltimosPesosUsuarioYRangoPesoIdeal);
// GET CLASIFICACION POR PUNTOS
  app.get("/api/user/getClasificacionPorPuntos",[authJwt.verifyToken], gamification.getClasificacionPorPuntos);
// GET ACTIVIDADES RECIENTES
  app.get("/api/user/getActividadesRecientes",[authJwt.verifyToken], gamification.getActividadesRecientes);
// GET RETOS DIARIOS DEL USUARIO
  app.get("/api/user/getRetosDiariosDelUsuario",[authJwt.verifyToken], gamification.getRetosDiariosDelUsuario);
// GET TODOS LOS ALIMENTOS
  app.get("/api/user/getAllFood",[authJwt.verifyToken], controller.getAllFood);

// MARCAR RECOMENDACION COMO COMPLETADA
  app.post("/api/user/marcarRecomendacionComoCompletada",[authJwt.verifyToken], controller.marcarRecomendacionComoCompletada);
  // SUMAR PUNTUACION A USUARIO POR ELEMENTO
  app.post("/api/user/sumarPuntuacionAUsuarioPorElemento",[authJwt.verifyToken], gamification.sumarPuntuacionAUsuarioPorElemento);
// INSERTAR COMIDA EN EL REGISTRO
  app.post("/api/user/insertFoodRegistration", [verifyOneFoodAtDay,authJwt.verifyToken] , controller.insertarComidaDiariaPorId);
// MARCAR RETO COMO COMPLETADO
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