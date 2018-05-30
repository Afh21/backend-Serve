var express = require('express');
var bcrypt = require('bcryptjs');
var jwt     = require('jsonwebtoken');
var SEED    = require('../config/config').SEED;
var middlewareAuth = require('../middlewares/authentication');

var app = express();

var UsuarioModel = require('../models/usuario');  // Schema

// ==========================
// GET - Usuarios
// ==========================
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    UsuarioModel.find({}, 'nombre email img role')
    .skip(desde)
    .limit(5)
    .exec( 

        (err, usuarios) => {

            if(err) {             

                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error en Database!',  
                    errors: err 
                }); // Status 500 - Error en base de datos.

            }

            UsuarioModel.count({}, (err, conteo)=>{
                
                response.status(200).json({
                    ok: true,
                    mensaje: 'Get Usuarios!',                
                    usuarios: usuarios,                    
                    total:    conteo  
                });    // Status 200 - Todo exitoso.

             })


        });       
});






// ==========================
// PUT - Actualizar usuario
// ==========================

app.put('/:id', middlewareAuth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    UsuarioModel.findById(id, (err, usuario)=> {

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Erro al buscar usuario',
                errors: err
            })
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error con ID ' +id+ ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            })
        }

        usuario.nombre = body.nombre;
        usuario.email  = body.email;
        usuario.role   = body.role;
        usuario.save( (err, usuarioGuardado) => {

            if(err){ 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';


            res.status(200).json({
                ok: true,
                mensaje: 'Usuario actualizado !',
                usuario: usuarioGuardado
            });    
        });
    })
})


// ==========================
// POST - Usuarios
// ==========================

app.post('/', middlewareAuth.verificaToken , (req, resp) => {

    var body = req.body;

    var usuario = new UsuarioModel({
        nombre:   body.nombre,
        email:    body.email,
        password: bcrypt.hashSync(body.password, 10),
        img:      body.img,
        role:     body.role
    });

    usuario.save( (err, usuarioGuardado) => {
        if(err) {             

            return resp.status(400).json({
                ok: false,
                mensaje: 'Error en al crear Usuario!',  
                errors: err 
            }); // Status 500 - Error en base de datos.
            
            console.error(err);
        }

        resp.status(201).json({
            ok: true,
            mensaje: 'Usuario creado !',
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });    // Status 200 - Todo exitoso.


    });

})





// ==========================
// DELETE - Eliminar Usuario por :id
// ==========================

app.delete('/:id', middlewareAuth.verificaToken, (req, res)=>{

    var id = req.params.id;
    UsuarioModel.findByIdAndRemove(id, (err, usuarioEliminado)=>{

        if(err){ 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Usuario',
                errors: err
            });
        }        

        if(!usuarioEliminado){ 
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Usuario borrado !',
            usuario: usuarioEliminado
        }); 
    })
})








module.exports = app;