var express = require('express');
var app = express();
var UsuarioModel = require('../models/usuario');  // Schema


// ==========================
// GET - Usuarios
// ==========================
app.get('/', (request, response, next) => {

    UsuarioModel.find({}, 'nombre email img role')
    .exec( 

        (err, usuarios) => {

            if(err) {             

                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error en Database!',  
                    errors: err 
                }); // Status 500 - Error en base de datos.

            }

            response.status(200).json({
                ok: true,
                mensaje: 'Get Usuarios!',
                usuarios: usuarios
            });    // Status 200 - Todo exitoso.

        });       
});


// ==========================
// POST - Usuarios
// ==========================

app.post('/', (req, resp) => {

    var body = req.body;

    var usuario = new UsuarioModel({
        nombre:   body.nombre,
        email:    body.email,
        password: body.password,
        img:      body.img,
        role:     body.role
    });

    usuario.save( (err, usuarioGuardado) => {
        if(err) {             

            return resp.status(500).json({
                ok: false,
                mensaje: 'Error en al crear Usuario!',  
                errors: err 
            }); // Status 500 - Error en base de datos.
            
            console.error(err);
        }

        resp.status(201).json({
            ok: true,
            mensaje: 'Usuario creado !',
            usuario: usuarioGuardado
        });    // Status 200 - Todo exitoso.


    });

})


module.exports = app;