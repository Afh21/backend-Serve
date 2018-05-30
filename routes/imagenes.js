var express = require('express');
var app = express();
var fs  = require('fs');
var path = require('path');


app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img  = req.params.img;

    var pathImg = `./uploads/${tipo}/${img}`;    

    if( !fs.existsSync(pathImg) ) {

        pathImg = './assets/ImgNoDisponible.png';        
        return res.sendFile(path.resolve(pathImg));
                                    
    }

    // res.sendFile( path.join('../uploads/'+tipo+'/'+img, { root: __dirname}) );        
    // res.sendFile('./uploads/'+tipo+'/'+img, { root: path.join(__dirname, '../uploads') });
    // res.sendFile(pathImg, { root: __dirname });
    res.sendFile( path.resolve('uploads', tipo , img ));

    
});



module.exports = app;