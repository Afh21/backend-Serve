// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();  // Definir servidor express


// Body Parser
// Parse application/x-www-form-urleconded
app.use(bodyParser.urlencoded({ extended: false }))

// parce application/json
app.use(bodyParser.json())


// Importar rutas
var usuarioRoutes = require('./routes/usuario');
var loginRoutes   = require('./routes/login');
var appRoutes     = require('./routes/app');
var hospitalRoutes= require('./routes/hospital');
var medicoRoutes  = require('./routes/medico');
var busquedaRoutes= require('./routes/busqueda');
var uploadRoutes  = require('./routes/upload');
var imagenesRoutes= require('./routes/imagenes');



// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response)=>{
    if(error) throw err;
    console.log('Database: \x1b[32m%s\x1b[0m',' Online');
})


// Rutas
app.use('/usuario',  usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico',   medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload',   uploadRoutes);
app.use('/imagenes',imagenesRoutes);
app.use('/login',    loginRoutes);
app.use('/',         appRoutes);



// Listen Peticiones
app.listen(3000, ()=> {
    console.log('Express Server 3000: \x1b[32m%s\x1b[0m',' Online');
})