'use strict'

var path = require('path');

var fs = require('fs');

var moment = require('moment');

var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function savePublication(req, res){

    var params = req.body;

    if(!params.text) return res.status(200).send({
        message: 'Debes enviar un texto!'
    });

    var publication = new Publication();

    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if(err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if(!publicationStored) return res.status(200).send({
            message: 'No se pudo guardar la publicación'
        });

        return res.status(200).send({
            publication: publicationStored
        });
    });
}

function getPublications(req, res){
    var userId = req.user.sub;

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemPerPage = 4;

    Follow.find({user: userId}).populate('followed').exec((err, follows) => {
        if(err) return res.status(500).send({
            message: 'Error en la petición de los seguidores'
        });

        var followsClean = [];

        follows.forEach((follow) => {
            followsClean.push(follow.followed)
        });

        console.log(followsClean);

        //operador $in => buscar dentro de un array
        Publication.find({user: {"$in": followsClean}}).sort('created_at').populate('user').paginate(page, itemPerPage, (err, publications, total) => {
            if(err) return res.status(500).send({
                message: 'Error en la petición de tus publicaciones'
            });

            if(!publications) return res.status(404).send({
                message: 'No tienes publicaciones'
            });

            console.log(publications);  

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemPerPage),
                page: page,
                publications
            });
        });
    });
}

function getPublication(req, res){
    var pubId = req.params.id;

    Publication.findById(pubId, (error, publication) => {
        if(error) return res.status(500).send({
            message: 'Error en la petición de la publicación'
        });

        if(!publication) return res.status(404).send({
            message: 'No existe la publicación'
        });

        return res.status(200).send({
            publication
        });
    });
}

function deletePublication(req, res){
    var pubId = req.params.id;
    var userId = req.user.sub;

    Publication.find({'user': userId, '_id': pubId }).remove(error => {
        if(error) return res.status(500).send({
            message: 'Error en la petición de eliminación de la publicación'
        });

        return res.status(200).send({
            message: 'Publicación eliminada'
        });
    }); 
}

function uploadPublicationFile(req, res){
    var publicationId = req.params.id;

    if(req.files){
        var filePath = req.files.file.path;

        var fileSplit = filePath.split('\\');

        var fileName = fileSplit[2];

        var extSplit = fileName.split('\.');

        var fileExt = extSplit[1];

        if(fileExt){

            Publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((err, publication) => {
                if(publication){
                    Publication.findByIdAndUpdate(publicationId, {file: fileName}, {new: true}, (err, publicationUpdate) => {
                        if(err) return res.status(500).send({message: 'Error en la petición'});
        
                        if(!publicationUpdate) return res.status(404).send({message: 'No se ha podido actualizar'});
        
                        return res.status(200).send({publication: publicationUpdate});
                    });
                } else {
                    return removeFileOfUpload(res, filePath, 'No tienes permiso para actualizar este archivo');            
                }
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

function removeFileOfUpload(res, filePath, message){
    fs.unlink(filePath, (err) => {
        return res.status(200).send({
            message: message
        });
    });
}

function getPublicationFile(req, res){
    var publicationFile = req.params.publicationFile;

    var pathFile = './uploads/publications/' + publicationFile;

    fs.exists(pathFile, (exists) => {
        if(exists){
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({message: 'No existe la imagen!'});
        }
    });
}

module.exports = {
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadPublicationFile,
    getPublicationFile
}




