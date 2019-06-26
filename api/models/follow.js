'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;

var followSchema = schema({
    user: { type: schema.ObjectId, ref: 'User'},
    followed: { type: schema.ObjectId, ref: 'User'}
});

//La entidad User lo pone en minuscula y lo pluraliza en la BD => users
//la collecion que se va a guardar en la bd sera users
module.exports = mongoose.model('Follow', followSchema);

