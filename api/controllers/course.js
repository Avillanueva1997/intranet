'use strict'

var bcrypt = require('bcrypt-nodejs');

var mongoosePaginate = require('mongoose-pagination');

var fs = require('fs');

var path = require('path');

//PRIMERA LETRA CON MAYUSCULA PARA IDENTIFICAR QUE ES UN MODELO
var Course = require('../models/course');

var Follow = require('../models/follow');

var Publication = require('../models/publication');

var jwt = require('../services/jwt');


function saveCourse(req, res){
    var params = req.body;
    var course = new Course();

    if(params.codCurso && params.descripCurso &&
       params.state){

           course.codCurso = params.codCurso;
           course.descripCurso = params.descripCurso;
           course.state = params.state;

           Course.find({codCurso: course.codCurso.toLowerCase()}).exec((err,courses) => {
            if(err) return res.status(500).send({
                message: 'Error en la petición del curso!'
            });

            if(courses && courses.length >= 1){
                 return res.status(200).send({
                    message: 'El curso que intentas registrar ya existe!'
                });
            } else {
                course.save((err, courseStored ) => {
     
                    if(err) return res.status(500).send({
                        message: 'Error al guardar el curso!'
                    });
    
                    if(courseStored){
                        res.status(200).send({
                            course: courseStored
                        });
                    } else {
                        res.status(404).send({
                            message: 'No se ha registrado el curso'
                        });
                    }
    
                });
            }
           });           
       } else {
           res.status(200).send({
               message: 'Envia todos los campos necesarios!'
           });
       }
}

function getCourses(req, res){
    Course.find().sort('_id').exec((err, courses, total) => {

        if(err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if(!courses) return res.status(404).send({
            message: 'No hay cursos disponibles'
        });

        return res.status(200).send({
            courses,
            total    
        });
    });
}

function getCourse(req, res){
    //datos por la url se usa params si es por post body
    var courseId = req.params.id;
    
    Course.findById(courseId, (err, course) => {
        if(err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if(!course) return res.status(404).send({
            message: 'Curso no existe'
        });

        return res.status(200).send({
            course
        });
    });
}


module.exports = {
    saveCourse,
    getCourses,
    getCourse
}
