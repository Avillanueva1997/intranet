'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;

var userSchema = schema({
    name: String,
    fLastName: String,
    mLastName: String,
    fechaNac: String,
    dni: String,
    direccion: String,
    telefono: String,
    email: String,
    password: String,
    role: String
});

//La entidad User lo pone en minuscula y lo pluraliza en la BD => users
//la collecion que se va a guardar en la bd sera users
module.exports = mongoose.model('User', userSchema);

