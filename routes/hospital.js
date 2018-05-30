var express = require('express');
var middlewareAuth = require('../middlewares/authentication');
var app = express();

var HospitalModel = require('../models/hospital');  // Schema

// ==========================
// GET - Hospitales
// ==========================
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);


    HospitalModel.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')     // populate() consulta el modelo relacionado y devuleve la informacion que se necesite
    .exec( 

        (err, hospitales) => {

            if(err) {             

                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error en Database - Hospital!',  
                    errors: err 
                }); // Status 500 - Error en base de datos.

            }

            HospitalModel.count({}, (err, conteo)=>{
                
                response.status(200).json({
                    ok:         true,
                    mensaje:    'Get hospitales!',
                    hospitales: hospitales,
                    total:      conteo                
                });    // Status 200 - Todo exitoso.
            })


        });       
});






// ==========================
// PUT - Actualizar hospital
// ==========================

app.put('/:id', middlewareAuth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    HospitalModel.findById(id, (err, hospital)=> {

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Erro al buscar hospital',
                errors: err
            })
        }

        // Si no existe un hospital
        if(!hospital){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error con ID ' +id+ ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            })
        }

        hospital.nombre = body.nombre;        
        hospital.usuario= req.usuario._id;
        hospital.save( (err, hospitalGuardado) => {

            if(err){ 
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: 'Hospital actualizado !',
                hospital: hospitalGuardado
            });    
        });
    })
})


// ==========================
// POST - Usuarios
// ==========================

app.post('/', middlewareAuth.verificaToken , (req, resp) => {

    var body = req.body;

    var hospital = new HospitalModel({
        nombre:   body.nombre,        
        usuario: req.usuario._id
    });

    hospital.save( (err, hospitalGuardado) => {

        if(err) {             

            return resp.status(400).json({
                ok: false,
                mensaje: 'Error en al crear hospital!',  
                errors: err 
            }); // Status 500 - Error en base de datos.                    
        }

        resp.status(201).json({
            ok: true,
            mensaje: 'Usuario creado !',
            hospital: hospitalGuardado,            
        });    // Status 200 - Todo exitoso.


    });

})





// ==========================
// DELETE - Eliminar Usuario por :id
// ==========================

app.delete('/:id', middlewareAuth.verificaToken, (req, res)=>{

    var id = req.params.id;
    HospitalModel.findByIdAndRemove(id, (err, hospitalEliminado)=>{

        if(err){ 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Hospital',
                errors: err
            });
        }        

        if(!hospitalEliminado){ 
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID',
                errors: { message: 'No existe ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Hospital borrado !',
            hospital: hospitalEliminado
        }); 
    })
})


module.exports = app;