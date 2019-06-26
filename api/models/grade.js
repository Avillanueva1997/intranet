'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;

var gradeSchema = schema({
    codGrado: String,
    descripGrado: String,
    nivel: String
});

//La entidad User lo pone en minuscula y lo pluraliza en la BD => users
//la collecion que se va a guardar en la bd sera users
module.exports = mongoose.model('Grade', gradeSchema);