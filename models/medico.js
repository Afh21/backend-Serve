var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre:   { type: String, required: [true, 'Este campo es obligatorio ... ']},        
    img:      { type: String, required: false },
    usuario:  { type: Schema.Types.ObjectId, ref: 'usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'hospital', required: [true, 'El ID Hospital es obligatorio..']}
});

module.exports = mongoose.model('medico', medicoSchema);
