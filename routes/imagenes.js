var express = require('express');
var app = express();
var fs  = require('fs');


app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img  = req.params.res;

    var path = `../uploads/${tipo}/${img}`;

    fs.exists(path, existe => {
        if(!existe){
            path = '../assets/ImgNoDisponible.png'
        }

        res.sendFile(path)
    })

    /*
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion exitosa!'
    });    // Status 200 - Todo exitoso.
    */
});



module.exports = app;