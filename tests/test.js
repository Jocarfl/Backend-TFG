const request = require("supertest");
const app = require("../server.js");
const db = require("../models");
const User = db.user;
const Gamification = db.gamification;
const FoodHistories = db.foodhistory;


/*

ANTES DE INICIALIZAR LOS TESTS IR A LA CARPETA /ROUTES  Y ENTRAR EN LOS SCRIPTS:

ADMIN.ROUTES.JS

AUTH.ROUTES.JS

MOD.ROUTES.JS

USER.ROUTES.JS

*/


// Nuevo usuario MOD todo nuevo
const newMod = {
  username:"ModTest",
  email:"Modtest@hotmail.com",
  password:"test",
  first_name:"test",
  second_name:"test",
  dni:"09682126T",
  born_date:"10/5/2022",
  roles:["moderator"],
  gender:"masculino",
  height:188,
  ideal_weight:{
    min:80,
    max:85
  },
}

// Nuevo usuario todo nuevo
const newUser = {
  username:"Tests",
  email:"test@hotmail.com",
  password:"test",
  first_name:"test",
  second_name:"test",
  dni:"14836268A",
  born_date:"10/5/2022",
  gender:"masculino",
  height:188,
  ideal_weight:{
    min:80,
    max:85
  },
}

// Nuevo usuario con DNI repetido
const newUserDNI = {
  username:"TestsNuevo",
  email:"testNuevo@hotmail.com",
  password:"test",
  first_name:"test",
  second_name:"test",
  dni:"14836268A",
  born_date:"10/5/2022",
  gender:"masculino",
  height:188,
  ideal_weight:{
    min:80,
    max:85
  },
}

// Nuevo usuario con email repetido
const newUserEmail = {
  username:"TestsNuevo",
  email:"test@hotmail.com",
  password:"test",
  first_name:"test",
  second_name:"test",
  dni:"27128482M",
  born_date:"10/5/2022",
  gender:"masculino",
  height:188,
  ideal_weight:{
    min:80,
    max:85
  },
}

//Nuevo usuario con rol inexistente
const newUserRol = {
  username:"Tests",
  email:"test@hotmail.com",
  password:"test",
  first_name:"test",
  second_name:"test",
  dni:"14836268A",
  born_date:"10/5/2022",
  gender:"masculino",
  roles:"invented",
  height:188,
  ideal_weight:{
    min:80,
    max:85
  },
}

//-------------------------------------------
//
// TESTS RUTAS AUTENTICACIÓN
//
//-------------------------------------------

describe("TESTS RUTAS AUTENTICACIÓN", () => {

  // REGISTRAR USUARIO

  describe("Test POST /signup", ()=>{

    // REGISTRAR USUARIO NUEVO
    test("Registrar usuario nuevo: 200 status code", async () => {

      const response = await request(app).post("/api/auth/signup").send(newUser);
      expect(response.statusCode).toBe(200);
      
    });
    
    // REGISTRAR USUARIO CON NOMBRE DE USUARIO EXISTENTE
    test("Registrar usuario con nombre de usuario existente: 400 status code", async () => {
      const response = await request(app).post("/api/auth/signup").send(newUser);
      expect(response.statusCode).toBe(400);
      
    });
    
    // REGISTRAR USUARIO CON DNI EXISTENTE
    test("Registrar usuario con DNI existente: 400 status code", async () => {
      const response = await request(app).post("/api/auth/signup").send(newUserDNI);
      expect(response.statusCode).toBe(400);
   
    });
    
    // REGISTRAR USUARIO CON EMAIL EXISTENTE
    test("Registrar usuario con Email existente: 400 status code", async () => {
      const response = await request(app).post("/api/auth/signup").send(newUserEmail);
      expect(response.statusCode).toBe(400);
   
    });
    
    // REGISTRAR USUARIO CON ROL INEXISTENTE
    test("Registrar usuario con Rol inexistente: 400 status code", async () => {
      const response = await request(app).post("/api/auth/signup").send(newUserRol);
      expect(response.statusCode).toBe(400);
  
    });



  });


  // INICIAR SESIÓN
  describe("Test POST /signin", () => {
    
    // INICIAR SESIÓN CON USUARIO EXISTENTE
    test("Iniciar sesión con usuario existente: 200 status code", async () => {
      const response = await request(app).post("/api/auth/signin").send(newUser);
      expect(response.statusCode).toBe(200);
  
    });
    
    // INICIAR SESIÓN CORRECTAMENTE 
    test("Al iniciar sesión correctamente debe devolver token de acceso: AccesToken", async () => {
      const response = await request(app).post("/api/auth/signin").send(newUser);
      expect(response.body.accessToken).toBeDefined();
  
    });
    
    // INICIAR SESIÓN CON USUARIO INEXISTENTE
    test("Iniciar sesión con usuario inexistente: 404 status code", async () => {
      const response = await request(app).post("/api/auth/signin").send(newUserDNI);
      expect(response.statusCode).toBe(404);
  
      
    });
    
  });
  

});





//-------------------------------------------
//
// TESTS RUTAS ADMINISTRADOR
//
//-------------------------------------------

describe("TESTS RUTAS ADMINISTRADOR", () => {

  // GET TODOS LOS MODERADORES
  describe("Test GET /getAllModerators", () => {
    
    // DEVOLVER STATUS 200
    test("Debe devolver: 200 status code", async () => {
      const response = await request(app).get("/api/admin/getAllModerators").send();
      expect(response.statusCode).toBe(200);
      
    });

    // DEVOLVER ARRAY
    test("Debe devolver una lista de todos los Médicos: Array List", async () => {
      const response = await request(app).get("/api/admin/getAllModerators").send();
      expect(response.body).toBeInstanceOf(Array);
      
    });

});

// VINCULAR USUARIO CON MÉDICO
describe("Test POST /vincularUsuarioConMod", () => {
  
  // DEVOLVER STATUS 200
  test("Vincular DNI de paciente con médico: 200 status code", async () => {


    //insertar nuevo Moderador
    await request(app).post("/api/auth/signup").send(newMod);

    const datos = {
      //dni del usuario test creado anteriormente
      dni: "14836268A",
      id_mod: ""
    }

    // BUSCAR ID DEL USUARIO
    await User.findOne({username: newMod.username}).then(
      res => datos.id_mod = res._id,
      err=> console.log(err),
     );
     
    
    const response = await request(app).post("/api/admin/vincularUsuarioConMod").send(datos);
    expect(response.statusCode).toBe(200);
       
  });

});

// GET PACIENTES VINCULADOS AL MODERADOR
describe("Test GET /getPacientesVinculadosAlModerador", () => {
  
  // DEVOLVER STATUS 200
  test("Debe devolver: 200 status code", async () => {

    const datos = {
      _id : ""
    }
    
    // BUSCAR ID
   await User.findOne({username: newMod.username}).then(
    res => datos._id = res._id,
    err=> console.log(err),
   );
    
    
    const response = await request(app).get("/api/admin/getPacientesVinculadosAlModerador?_id="+ datos._id)

    expect(response.statusCode).toBe(200);

    
  });

  // DEVOLVER ARRAY 
  test("Debe devolver una lista con todos los pacientes vinculados al médico : Array List", async () => {

    const datos = {
      _id : ""
    }
    
    // BUSCAR ID
   await User.findOne({username: newMod.username}).then(
    res => datos._id = res._id,
    err=> console.log(err),
   );
    
    
    const response = await request(app).get("/api/admin/getPacientesVinculadosAlModerador?_id="+ datos._id)

    expect(response.body).toBeInstanceOf(Array);

    
  });

});

});


//-------------------------------------------
//
// TESTS RUTAS MODERADOR (MÉDICO)
//
//-------------------------------------------


describe("TESTS RUTAS MODERADOR (MÉDICO)", () => {

  // GET REGISTRO COMIDA DE PACIENTE POR FECHA
  describe("Test GET /getRegistroComidaDePacientePorFecha", () => {

    // DEVOLVER STATUS 200
    test("Debe devolver: 200 status code", async () => {

      const datos = {
        _id : "",
        date: new Date()
      }
      
      // BUSCAR ID
     await User.findOne({username: newUser.username}).then(
      res => datos._id = res._id,
      err => console.log(err),
     );

      const response = await request(app).get("/api/mod/getRegistroComidaDePacientePorFecha?_id="+datos._id+"&date="+datos.date).send();
      expect(response.statusCode).toBe(200);
      
    });

    //DEVOLVER JSON
    test("Debe devolver un objeto vacío de las comidas: JSON", async () => {

      const datos = {
        _id : "",
        date: new Date()
      }

      // BUSCAR ID
      await User.findOne({username: newUser.username}).then(
        res => datos._id = res._id,
        err => console.log(err),
       );

      const response = await request(app).get("/api/mod/getRegistroComidaDePacientePorFecha?_id="+datos._id+"&date="+datos.date).send();     

      expect(response.body).objectContaining;
      
    });

});

// INSERTAR PESO DEL PACIENTE EN EL REGISTRO
describe("Test POST /insertarPesoPacienteEnHistorial", () => {
  
  //DEVOLVER STATUS 200
  test("Debe devolver: 200 status code", async () => {

    const datos = {
      _id : "",
      weight: 99 //peso de prueba
    }
    
    //BUSCAR ID
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).post("/api/mod/insertarPesoPacienteEnHistorial").send(datos);
    
    expect(response.statusCode).toBe(200);
    
  });

});

// INSERTAR RECOMENDACION PACIENTE
describe("Test POST /insertarRecomendacionPaciente", () => {
  
  test("Debe devolver: 200 status code", async () => {

    //datos de prueba
    const datos = {
      _id : "",
      title: "Prueba",
      description: "Esto es una prueba"
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).post("/api/mod/insertarRecomendacionPaciente").send(datos);
    

    expect(response.statusCode).toBe(200);
    
  });

});

// GET HISTORIAL DE PESO DEL PACIENTE
describe("Test GET /getHistorialPesoPaciente", () => {


  //STATUS 200
  test("Debe devolver: 200 status code", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/mod/getHistorialPesoPaciente?_id="+datos._id).send();
    expect(response.statusCode).toBe(200);
    
  });

  // ARRAY LIST
  test("Debe devolver una lista de los pesos registrados: Array List", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/mod/getHistorialPesoPaciente?_id="+datos._id).send();   
    expect(response.body).toBeInstanceOf(Array);
    
    });

    // TAMAÑO = 1
  test("El tamaño de la lista debe ser igual a 1", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/mod/getHistorialPesoPaciente?_id="+datos._id).send();   
    expect(response.body).toHaveLength(1);
    
  });

});

// GET RECOMENDACIONES DEL PACIENTE
describe("Test GET /getRecomendacionesDelPaciente", () => {

  // STATUS 200
  test("Debe devolver: 200 status code", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/mod/getRecomendacionesDelPaciente?_id="+datos._id).send();
    expect(response.statusCode).toBe(200);
    
  });

  // ARRAY LIST
  test("Debe devolver una lista de las recomendaciones registradas: Array List", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/mod/getRecomendacionesDelPaciente?_id="+datos._id).send();   
    expect(response.body).toBeInstanceOf(Array);
    
  });

  // TAMAÑO = 1
  test("El tamaño de la lista debe ser igual a 1", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/mod/getRecomendacionesDelPaciente?_id="+datos._id).send();   
     expect(response.body).toHaveLength(1);
    
  });

});

});

//-------------------------------------------
//-------------------------------------------
// TESTS RUTAS USUARIO (PACIENTE)
//-------------------------------------------
//-------------------------------------------

describe("TESTS RUTAS USUARIO (PACIENTE)", () => {

  // GET RECOMENDACIONES DEL PACIENTE
  describe("Test GET /getRecomendacionesDelPaciente", () => {
    
    // STATUS 200
    test("Debe devolver: 200 status code", async () => {

      const datos = {
        _id : ""
      }
   
     await User.findOne({username: newUser.username}).then(
      res => datos._id = res._id,
      err => console.log(err),
     );

      const response = await request(app).get("/api/user/getRecomendacionesDelPaciente?_id="+datos._id).send();
      expect(response.statusCode).toBe(200);
      
    });

    // ARRAY LIST
    test("Debe devolver una lista de las recomendaciones del paciente: Array List", async () => {

      const datos = {
        _id : ""
      }
   
     await User.findOne({username: newUser.username}).then(
      res => datos._id = res._id,
      err => console.log(err),
     );

      const response = await request(app).get("/api/user/getRecomendacionesDelPaciente?_id="+datos._id).send();
      expect(response.body).toBeInstanceOf(Array);
      
    });

    // TAMAÑO = 1
    test("El tamaño de la lista debe ser igual a 1", async () => {

      const datos = {
        _id : ""
      }
   
     await User.findOne({username: newUser.username}).then(
      res => datos._id = res._id,
      err => console.log(err),
     );

      const response = await request(app).get("/api/user/getRecomendacionesDelPaciente?_id="+datos._id).send();
      

      expect(response.body).toHaveLength(1);
      
    });

});

// GET INFORMACION GAMIFICACION POR ID
describe("Test GET /getInfoGamificacionPorId", () => {
  
  // STATUS 200
  test("Debe devolver: 200 status code", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/user/getInfoGamificacionPorId?_id="+datos._id).send();
    expect(response.statusCode).toBe(200);
    
  });

    // JSON
  test("Debe devolver un objeto : JSON", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/user/getInfoGamificacionPorId?_id="+datos._id).send();
    expect(response.body).objectContaining;
    
  });

});

// GET ULTIMOS PESOS DEL USUARIO
describe("Test GET /getUltimosPesosUsuario", () => {
  
  // STATUS 200
  test("Debe devolver: 200 status code", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/user/getUltimosPesosUsuario?_id="+datos._id).send();
    expect(response.statusCode).toBe(200);
    
  });

  // JSON {ARRAY , JSON}
  test("Debe devolver un objeto (listaPesos y rangoPesoIdeal) : JSON", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/user/getUltimosPesosUsuario?_id="+datos._id).send();
    expect(response.body).objectContaining;
    
  });

  // ARRAY
  test("Debe devolver una lista : Array List", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/user/getUltimosPesosUsuario?_id="+datos._id).send();
    expect(response.body.listaPesos).toBeInstanceOf(Array);
    
  });

  // TAMAÑO = 1
  test("El tamaño de la lista debe ser 1", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/user/getUltimosPesosUsuario?_id="+datos._id).send();
    expect(response.body.listaPesos).toHaveLength(1);
    
  });

});

// GET CLASIFICACION POR PUNTOS
describe("Test GET /getClasificacionPorPuntos", () => {
  
  //STATUS 200
  test("Debe devolver: 200 status code", async () => {

    const response = await request(app).get("/api/user/getClasificacionPorPuntos").send();
    expect(response.statusCode).toBe(200);
    
  });

  // ARRAY
  test("Debe devolver una lista : Array List", async () => {

    const response = await request(app).get("/api/user/getClasificacionPorPuntos").send();

    expect(response.body).toBeInstanceOf(Array);
    
  });

});

// GET ACTIVIDADES RECIENTES
describe("Test GET /getActividadesRecientes", () => {
  
  // STATUS 200
  test("Debe devolver: 200 status code", async () => {

    const response = await request(app).get("/api/user/getActividadesRecientes").send();
    expect(response.statusCode).toBe(200);
    
  });

  //ARRAY
  test("Debe devolver una lista : Array List", async () => {

    const response = await request(app).get("/api/user/getActividadesRecientes").send();

    expect(response.body).toBeInstanceOf(Array);
    
  });

});

// GET RETOS DIARIOS DEL USUARIO
describe("Test GET /getRetosDiariosDelUsuario", () => {
  
  //STATUS 200
  test("Debe devolver: 200 status code", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/user/getRetosDiariosDelUsuario?_id="+datos._id).send();
    expect(response.statusCode).toBe(200);
    
  });

  // ARRAY
  test("Debe devolver una lista : Array List", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/user/getRetosDiariosDelUsuario?_id="+datos._id).send();

    expect(response.body).toBeInstanceOf(Array);
    
  });


  // TAMAÑO = 3
  test("El tamaño de la lista debe ser: 3", async () => {

    const datos = {
      _id : ""
    }
 
   await User.findOne({username: newUser.username}).then(
    res => datos._id = res._id,
    err => console.log(err),
   );

    const response = await request(app).get("/api/user/getRetosDiariosDelUsuario?_id="+datos._id).send();

    expect(response.body).toHaveLength(3);
  });

});

// GET TODA LA ALIMENTACION DE LA BD
describe("Test GET /getAllFood", () => {
  
  //STATUS 200
  test("Debe devolver: 200 status code", async () => {

    const response = await request(app).get("/api/user/getAllFood").send();
    expect(response.statusCode).toBe(200);
    
  });

  // ARRAY
  test("Debe devolver una lista : Array List", async () => {

    const response = await request(app).get("/api/user/getAllFood").send();
    expect(response.body).toBeInstanceOf(Array);
    
  });
});

// MARCAR RECOMENDACION COMO COMPLETADO
describe("Test POST /marcarRecomendacionComoCompletada", () => {
  
  //STATUS 200
  test("Debe devolver: 200 status code", async () => {

    var _id = "";
    
    await User.findOne({username: newUser.username}).then(
      res => _id = res._id,
      err => console.log(err),
    );
   
    const recomendaciones = await request(app).get("/api/user/getRecomendacionesDelPaciente?_id="+_id).send();
    
    const datos = {
      _id : _id,
      idRec: recomendaciones.body[0]._id
    }


    const response = await request(app).post("/api/user/marcarRecomendacionComoCompletada").send(datos);

    expect(response.statusCode).toBe(200);
    
  });


});

// SUMAR PUNTUACION A USUARIO POR ELEMENTO
describe("Test POST /sumarPuntuacionAUsuarioPorElemento", () => {
  
  //200 STATUS
  test("Debe devolver: 200 status code", async () => {

    const datos = {
      _id : "",
      elemento:"retos"
    }

    await User.findOne({username: newUser.username}).then(
      res => datos._id = res._id,
      err => console.log(err),
    );


    const response = await request(app).post("/api/user/sumarPuntuacionAUsuarioPorElemento").send(datos);
    expect(response.statusCode).toBe(200);
    
  });


});

// INSERTAR FOOD REGISTRATION
describe("Test POST /insertFoodRegistration", () => {
  
  //200 STATUS
  test("Debe devolver: 200 status code", async () => {

    const datos = {
      id : "",
      comidas : {
        desayuno:[{
          "id": "680",
          "nombre": "Bacón, ahumado, a la parrilla",
          "energiaT": "1215.5",
          "grasaT": "22.1",
          "proteinaT": "23.4",
          "__v": 0
        }],
        almuerzo:[],
        comida:[],
        merienda:[],
        cena:[],
      }
    }

    await User.findOne({username: newUser.username}).then(
      res => datos.id = res._id,
      err => console.log(err),
    );


    const response = await request(app).post("/api/user/insertFoodRegistration").send(datos);
    expect(response.statusCode).toBe(200);
    
  });

    // 403 STATUS
  test("Al volver a insertar una comida debería devolver: 403 status code", async () => {

    const datos = {
      id : "",
      comidas : {
        desayuno:[{
          "id": "680",
          "nombre": "Bacón, ahumado, a la parrilla",
          "tipo": [],
          "energiaT": 24310,
          "grasaT": 442,
          "proteinaT": 468,
          "caloriasT": 5806.34626,
          "cantidad": "2000"
        }],
        almuerzo:[],
        comida:[],
        merienda:[],
        cena:[],
      }
    }

    await User.findOne({username: newUser.username}).then(
      res => datos.id = res._id,
      err => console.log(err),
    );


    const response = await request(app).post("/api/user/insertFoodRegistration").send(datos);
    expect(response.statusCode).toBe(403);
    
  });


});

// MARCAR RETO COMO COMPLETADO
describe("Test POST /marcarRetoComoCompletado", () => {
  
  // 200 STATUS
  test("Debe devolver: 200 status code", async () => {

    var _id = "";
    
    await User.findOne({username: newUser.username}).then(
      res => _id = res._id,
      err => console.log(err),
    );
   
    const retos = await request(app).get("/api/user/getRetosDiariosDelUsuario?_id="+_id).send();

    const datos = {
      _id : _id,
      idReto: retos.body[0]._id
    }

    const response = await request(app).post("/api/user/marcarRetoComoCompletado").send(datos);

    //-------------------------------------------------------------
    //-------------------------------------------------------------
    // Borrar todos los nuevos datos que se han creado
    //-------------------------------------------------------------

    var id_User = "";
    var id_Mod = "";

    await User.findOne({username: newMod.username}).then(
      res => id_Mod = res._id,
      err => console.log(err),
    );

    await User.findOne({username: newUser.username}).then(
      res => id_User = res._id,
      err => console.log(err),
    );

    User.findOneAndDelete({username: newUser.username}).exec();
    User.findOneAndDelete({username: newMod.username}).exec();
    Gamification.findOneAndDelete({_id: id_Mod}).exec();
    Gamification.findOneAndDelete({_id: id_User}).exec();
    FoodHistories.findOneAndDelete({_id: id_Mod}).exec();
    FoodHistories.findOneAndDelete({_id: id_User}).exec();
  
  //-------------------------------------------------------------
  //-------------------------------------------------------------

    expect(response.statusCode).toBe(200);
    
  });


});

});



