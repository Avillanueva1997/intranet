'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;

var publicationSchema = schema({
    text: String,
    file: String,
    created_at: String,
    user: { type: schema.ObjectId, ref: 'User'}
});

//La entidad User lo pone en minuscula y lo pluraliza en la BD => users
//la collecion que se va a guardar en la bd sera users
module.exports = mongoose.model('Publication', publicationSchema);

