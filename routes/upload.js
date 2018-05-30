var express    = require('express');
var app        = express();
var fileUpload = require('express-fileupload');
var fs         = require('fs');

var UsuarioModel  = require('../models/usuario');
var MedicoModel   = require('../models/medico');
var HospitalModel = require('../models/hospital');



// default options
app.use(fileUpload())

app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id   = req.params.id;

    // Tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: false,
            mensjae: 'Tipo de coleccion no es válida',
            errors: { message: 'Coleccion' }
        });
    }



    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensjae: 'Error cargando imagen',
            errors: { message: 'Debe seleccionar una imagen. ' }
        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length -1];

    // Extension validas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extensionArchivo) <0 ){
        return res.status(400).json({
            ok: false,
            mensjae: 'Extension no válida',
            errors: { message: 'Extensiones válidas: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo  = `${id}-${new Date().getMilliseconds()}.${ extensionArchivo }`;

    // Mover el archivo
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    
    archivo.mv( path , err => {
        if(err){
            return res.status(500).json({
                ok:      false,
                mensaje: 'Error al mover el archivo',
                errors:  err
            })
        }        

        // Llamado de la funcion
        subirPorTipo(tipo, id, nombreArchivo, res);

    })
});


function subirPorTipo(tipo, id, nombreArchivo, res){
    
    if( tipo == 'usuarios') {

        
        UsuarioModel.findById( id, (err, usuario)=>{   
            
            if(!usuario){
                return  res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe, verifique por favor!',
                    errors: { message: "Usuario no existe!"}
                })
            }

            // Si existe elimina la imagen anterior.
            if ( fs.existsSync('./uploads/usuarios/'+usuario.img) ) {
                fs.unlinkSync('./uploads/usuarios/'+usuario.img);
            }

            usuario.img = nombreArchivo;
            usuario.save( (err, usuarioActualizado)=> {
                
                usuarioActualizado.password = ':)'

                if(err){
                   return  res.status(500).json({
                        ok: true,
                        mensaje: 'Error al actualizar el archivo...'               
                    })
                }

                res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioActualizado               
                })
            })

        })
    }

    if( tipo == 'medicos') {

        MedicoModel.findById( id, (err, medico)=>{  
            
            if(!medico){
                return  res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe, verifique por favor!',
                    errors: { message: "Medico no existe!"}
                })
            }
                                            
            // Si existe elimina la imagen anterior.
            if ( fs.existsSync('./uploads/medicos/'+medico.img) ) {
                fs.unlinkSync('./uploads/medicos/'+medico.img);
            }

            medico.img = nombreArchivo;
            medico.save( (err, medicoActualizado)=> {
                
                medicoActualizado = ':)'

                if(err){
                   return  res.status(500).json({
                        ok: true,
                        mensaje: 'Error al actualizar el archivo...'               
                    })
                }

                res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizado',
                    usuario: usuarioActualizado               
                })
            })

        })
        
    }

    if( tipo == 'hospitales') {
        
        HospitalModel.findById( id, (err, hospital)=>{   

            if(!hospital){
                return  res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe, verifique por favor!',
                    errors: { message: "Hospital no existe!"}
                })
            }
                                            
            // Si existe elimina la imagen anterior.
            if ( fs.existsSync('./uploads/hospital/'+hospital.img) ) {
                fs.unlinkSync('./uploads/hospital/'+hospital.img);
            }

            hospital.img = nombreArchivo;
            hospital.save( (err, hospitalActualizado) => {
                
                hospitalActualizado = ':)'

                if(err){
                   return  res.status(500).json({
                        ok: true,
                        mensaje: 'Error al actualizar el archivo...'               
                    })
                }

                res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizado',
                    usuario: hospitalActualizado               
                })
            })

        })
    }

}

module.exports = app;