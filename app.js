// Requires
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables
var app = express();  // Definir servidor express

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response)=>{
    if(error) throw err;
    console.log('Database: \x1b[32m%s\x1b[0m',' Online');
})


// Rutas
app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        mensaje: 'Peticion exitosa!'
    });    // Status 200 - Todo exitoso.
});


// Listen Peticiones
app.listen(3000, ()=> {
    console.log('Express Server 3000: \x1b[32m%s\x1b[0m',' Online');
})