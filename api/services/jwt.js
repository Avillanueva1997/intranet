'use strict'

var jwt = require('jwt-simple');

var moment = require('moment');

var secret = 'pyMinkay';

//crear token

exports.createToken = function(user){

    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        //fecha creacion del token
        iat: moment().unix(),
        //fecha de expiracion
        exp: moment().add(30, 'days').unix
    }

    return jwt.encode(payload, secret);

}