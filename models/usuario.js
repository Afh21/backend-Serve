var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre:   { type: String, required: [true, 'Este campo es obligatorio ... ']},
    email:    { type: String, unique: true, required: [true, 'Este campo es obligatorio ... ']},
    password: { type: String, required: [true, 'Este campo es obligatorio ... ']},
    img:      { type: String, required: false },
    role:     { type: String, required: true, default: 'USER_ROLE' }
});

module.exports = mongoose.model('usuario', usuarioSchema);