'use strict'

var bcrypt = require('bcrypt-nodejs');

var mongoosePaginate = require('mongoose-pagination');

var fs = require('fs');

var path = require('path');

//PRIMERA LETRA CON MAYUSCULA PARA IDENTIFICAR QUE ES UN MODELO
var User = require('../models/user');

var Follow = require('../models/follow');

var Publication = require('../models/publication');

var jwt = require('../services/jwt');


function home(req, res){
    res.status(200).send({
        message: 'Hola Mundo desde el servidor de nodeJS'

    });
}

function pruebas(req, res){
    console.log(req.body);
    res.status(200).send({
        message: 'Prueba en el servidor de nodeJS'

    });
}

function saveUser(req, res){
    var params = req.body;
    var user = new User();

    if(params.name && params.fLastName &&
       params.mLastName && params.fechaNac &&
       params.dni && params.direccion &&
       params.telefono && params.email &&
       params.role ){

           user.name = params.name;
           user.fLastName = params.fLastName;
           user.mLastName = params.mLastName;
           user.fechaNac = params.fechaNac;
           user.dni = params.dni;
           user.direccion = params.direccion;
           user.telefono = params.telefono;
           user.email = params.email;
           user.role = params.role;

           params.password = 'a' + params.dni + '0';


           User.find({ $or:[
                {dni: user.dni.toLowerCase()},
                {email: user.email.toLowerCase()}
           ]}).exec((err,users) => {
            if(err) return res.status(500).send({
                message: 'Error en la petición del usuario!'
            });

            if(users && users.length >= 1){
                 return res.status(200).send({
                    message: 'El usuario que intentas registrar ya existe'
                });
            } else {
                bcrypt.hash(params.password, null, null, (err, hash)=>{
                    user.password = hash;
     
                    user.save((err, userStored ) => {
     
                     if(err) return res.status(500).send({
                         message: 'Error al guardar el usuario!'
                     });
     
                     if(userStored){
                         res.status(200).send({
                             user: userStored
                         });
                     } else {
                         res.status(404).send({
                             message: 'No se ha registrado el usuario'
                         });
                     }
     
                    });
                });
            }
           });           
       } else {
           res.status(200).send({
               message: 'Envia todos los campos necesarios!'
           });
       }

}

function loginUser(req, res){

    var params = req.body;

    var email = params.email;
    var password = params.password;

    //select * where and ({,})

    User.findOne({email: email}, (err, user) =>{
        if(err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if(user){
            bcrypt.compare(password, user.password, (err, check) =>{
                if(check){
                    
                    if(params.getToken){
                        //generar y devolver token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });

                    } else {
                        //devolver datos del usuario
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                    
                } else {
                    return res.status(404).send({
                        message: 'Usuario no encontrado'
                    });
                }

            })
        } else {
            return res.status(404).send({
                message: 'Usuario no encontrado'
            });
        }

    });

}

function getUser(req, res){
    //datos por la url se usa params si es por post body
    var userId = req.params.id;
    
    User.findById(userId, (err, user) => {
        if(err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if(!user) return res.status(404).send({
            message: 'Usuario no existe'
        });

        return res.status(200).send({
            user
        });
    });
}


function getUsers(req, res){
    User.find().sort('_id').exec((err, users, total) => {

        if(err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if(!users) return res.status(404).send({
            message: 'No hay usuarios disponibles'
        });

        return res.status(200).send({
            users,
            total    
        });
    });
}



function getCounters(req,res){
    var userId = req.user.sub;

    if(req.params.id){
        userId = req.params.id;        
    } 

    getCountFollow(userId).then((value)=>{
        console.log(value);
        res.status(200).send({
            value
        });
    });


}

async function getCountFollow(user_id){
    var following = await Follow.count({'user': user_id}).exec().then((count) => {
        return count;
    }).catch((e) => {
        return handleError(e); 
    });

    var followed = await Follow.count({'followed': user_id}).exec().then((count) => {
        return count;
    }).catch((e) => {
        return handleError(e); 
    });

    var publications = await Publication.count({'user': user_id}).exec().then((count) => {
        console.log(count);
        return count;
    }).catch((e) => {
        return handleError(e); 
    });

    return {
        following: following,
        followed: followed,
        publications: publications
    }
}

function updateUser(req, res){
    var userId = req.params.id;

    var update = req.body;

    //borrar propiedad
    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({
            message: 'No tienes permiso para actualizar los datos del usuario!'
        });
    }

    //la opcion new: true || devuelve el obj actualizado

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdate) => {
        if(err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if(!userUpdate) return res.status(400).send({
            message: 'No se ha podido actualizar los datos'
        });

        return res.status(200).send({user: userUpdate});
    });


}

function uploadImage(req, res){
    var userId = req.params.id;

    if(req.files){
        var filePath = req.files.image.path;

        var fileSplit = filePath.split('\\');

        var fileName = fileSplit[2];

        var extSplit = fileName.split('\.');

        var fileExt = extSplit[1];

        if(userId != req.user.sub){
             return removeFileOfUpload(res, filePath, 'No tienes permiso para actualizar los datos del usuario');
        }

        if(fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif' || fileExt == 'png' ){
            User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (err, userUpdate) => {
                if(err) return res.status(500).send({message: 'Error en la petición'});

                if(!userUpdate) return res.status(404).send({message: 'No se ha podido actualizar'});

                return res.status(200).send({user: userUpdate});
            });
            
        } else {
             return removeFileOfUpload(res, filePath, 'Extensión no válida');            
        }

    } else {
        return res.status(200).send({
            message: 'No se han subido imagenes'
        });
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;

    var pathFile = './uploads/users/' + imageFile;

    fs.exists(pathFile, (exists) => {
        if(exists){
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({message: 'No existe la imagen!'});
        }
    });

}

function removeFileOfUpload(res, filePath, message){
    fs.unlink(filePath, (err) => {
        return res.status(200).send({
            message: message
        });
    });
}


module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile    
}