const { verifyModUserLink,authJwt } = require("../middlewares");
const controller = require("../controllers/admin.controller");
const { isAdmin } = require("../middlewares/authJwt");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 // app.get("/api/admin/getAllModerators", [authJwt.verifyToken], controller.getAllModerators);

  app.get("/api/admin/getAllModerators", controller.getAllModerators);

  app.post("/api/admin/vincularUsuarioConMod",[verifyModUserLink.verifyUserRole,authJwt.verifyToken,authJwt.isAdmin] , controller.vincularUsuarioConMod);

  app.get("/api/admin/getPacientesVinculadosAlModerador", controller.getPacientesVinculadosAlModerador);
  
};