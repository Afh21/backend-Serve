var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre:   { type: String, required: [true, 'Este campo es obligatorio ... ']},        
    img:      { type: String, required: false },
    usuario:  { type: Schema.Types.ObjectId, ref: 'usuario' }   // Relacion
}, { collection: 'hospitales'} );

module.exports = mongoose.model('hospital', hospitalSchema);
