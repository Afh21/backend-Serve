var express = require('express');
var middlewareAuth = require('../middlewares/authentication');
var app = express();

var MedicoModel = require('../models/medico');  // Schema

// ==========================
// GET - Medico
// ==========================
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);


    MedicoModel.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital', 'nombre')
    .exec( 

        (err, medicos) => {

            if(err) {             

                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error en Database - Medico!',  
                    errors: err 
                }); // Status 500 - Error en base de datos.

            }

            MedicoModel.count({}, (err, conteo)=>{
                
                response.status(200).json({
                    ok: true,
                    mensaje: 'Get medicos!',
                    medicos: medicos,
                    total:   conteo
                });    // Status 200 - Todo exitoso.
            })


        });       
});






// ==========================
// PUT - Actualizar medico
// ==========================

app.put('/:id', middlewareAuth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    MedicoModel.findById(id, (err, medico)=> {

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Erro al buscar medico',
                errors: err
            })
        }

        // Si no existe un medico
        if(!medico){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error con ID ' +id+ ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            })
        }

        medico.nombre = body.nombre;        
        medico.usuario= req.usuario._id;
        medico.hospital = body.hospital

        medico.save( (err, medicoGuardado) => {

            if(err){ 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: 'Medico actualizado !',
                medico: medicoGuardado
            });    
        });
    })
})


// ==========================
// POST - Usuarios
// ==========================

app.post('/', middlewareAuth.verificaToken , (req, resp) => {

    var body = req.body;

    var medico = new MedicoModel({
        nombre:   body.nombre,        
        usuario:  req.usuario._id,
        hospital: body.hospital
    });

    medico.save( (err, medicoGuardado) => {

        if(err) {             

            return resp.status(400).json({
                ok: false,
                mensaje: 'Error en al crear medico!',  
                errors: err 
            }); // Status 500 - Error en base de datos.                    
        }

        resp.status(201).json({
            ok: true,
            mensaje: 'Medico creado !',
            medico: medicoGuardado,            
        });    // Status 200 - Todo exitoso.


    });

})





// ==========================
// DELETE - Eliminar Usuario por :id
// ==========================

app.delete('/:id', middlewareAuth.verificaToken, (req, res)=>{

    var id = req.params.id;
    MedicoModel.findByIdAndRemove(id, (err, medicoEliminado)=>{

        if(err){ 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Medico',
                errors: err
            });
        }        

        if(!medicoEliminado){ 
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese ID',
                errors: { message: 'No existe ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Usuario borrado !',
            medico: medicoEliminado
        }); 
    })
})


module.exports = app;