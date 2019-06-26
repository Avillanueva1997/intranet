'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;

var messageSchema = schema({
    emitter: { type: schema.ObjectId, ref: 'User'},
    receiver: { type: schema.ObjectId, ref: 'User'},
    text: String,
    viewed: String,
    created_at: String
});

//La entidad User lo pone en minuscula y lo pluraliza en la BD => users
//la collecion que se va a guardar en la bd sera users
module.exports = mongoose.model('Message', messageSchema);

    