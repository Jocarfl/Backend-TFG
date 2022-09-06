const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");

  //ENCABEZADO
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
 // REGISTRAR USUARIO
  app.post(
    "/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail,verifySignUp.checkDuplicateDNI,verifySignUp.checkRolesExisted,authJwt.verifyToken,authJwt.isAdmin], 
    controller.signup

  );
// INICIAR SESIÓN
  app.post("/api/auth/signin",
    controller.signin
    );
    

    /*
 -----------------------------
 -DESCOMENTAR PARA TESTS------
 -----------------------------
    app.post(
    "/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail,verifySignUp.checkDuplicateDNI,verifySignUp.checkRolesExisted], 
    controller.signup

  );

  app.post("/api/auth/signin",
    controller.signin
    );
    
    */
};