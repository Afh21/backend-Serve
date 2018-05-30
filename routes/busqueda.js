var express = require('express');
var app = express();

var HospitalModel = require('../models/hospital');
var MedicoModel   = require('../models/medico');
var UsuarioModel  = require('../models/usuario');



// ======================================
// Busqueda por Colección
// ======================================

app.get('/coleccion/:tabla/:busqueda', (req, resp)=> {

    var tabla    = req.params.tabla;
    var busqueda = req.params.busqueda;
    var promesa;

    var regex = new RegExp( busqueda, 'i' );


    switch( tabla ) {

        case 'usuario':
            promesa = buscarUsuarios(busqueda, regex);
        break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
        break;

        case 'hospitales':
            promesa = buscarHospital(busqueda, regex);
        break;

        default:
            resp.status(400).json({
                ok: false,
                mensaje: ' Las busquedas solo son en: Usuario, Medicos y Hospitales. !',                
                error: {
                    message: 'Tipo de tabla/colleccion no válido'
                }
            });   
    }

    promesa.then( data => {
        resp.status(200).json({
            ok: true,
            [tabla]: data   // Propiedades objetos Computadas/Procesadas
        });
    });

})



// ======================================
// Busqueda General
// ======================================


app.get('/todo/:busqueda', (req, resp, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i' );

    Promise.all([ 
            buscarHospital(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then( respuestas => {
            resp.status(200).json({
                ok: true,
                mensaje: 'Peticion exitosa!',
                hospital: respuestas[0],
                medicos:  respuestas[1],
                usuario:  respuestas[2]
            });    // Status 200 - Todo exitoso.

        })
});

function buscarHospital( busqueda, regex) {
    return new Promise( (resolve, reject)=> {
        HospitalModel.find({ nombre: regex })
                .populate('usuario', 'nombre email')   // populate trae toda la informacion de la relacion. Ojo! siempre va el exec()
                    .exec( (err, hospital)=> {
                        if(err){ 
                            reject('Error al cargar hospitales', err);
                        }else {
                            resolve(hospital);
                        }
                    });
                }) 
}

function buscarMedicos( busqueda, regex) {
    return new Promise( (resolve, reject)=> {
        MedicoModel.find({ nombre: regex }, (err, medico)=> {
            if(err){ 
                reject('Error al cargar medico', err);
            }else {
                resolve(medico);
            }
        });
    }) 
}


function buscarUsuarios( busqueda, regex) {
    return new Promise( (resolve, reject)=> {
        UsuarioModel.find({}, 'nombre email role ')
                    .or([ { 'nombre': regex}, { 'email': regex}  ])
                    .exec( (err, usuario) => {
                        if(err) { 
                            reject('Error al cargar usuarios', err);
                        } else {
                            resolve( usuario );
                        }
                    })
    })
}        




module.exports = app;