var express = require('express');
var app = express();



app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        mensaje: 'Peticion exitosa!'
    });    // Status 200 - Todo exitoso.
});



module.exports = app;