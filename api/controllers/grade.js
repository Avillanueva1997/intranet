'use strict'

var bcrypt = require('bcrypt-nodejs');

var mongoosePaginate = require('mongoose-pagination');

var fs = require('fs');

var path = require('path');

//PRIMERA LETRA CON MAYUSCULA PARA IDENTIFICAR QUE ES UN MODELO
var Grade = require('../models/grade');

var jwt = require('../services/jwt');


function saveGrade(req, res){
    var params = req.body;
    var grade = new Grade();

    if(params.codGrado && params.descripGrado &&
       params.nivel){

           grade.codGrado = params.codGrado;
           grade.descripGrado = params.descripGrado;
           grade.nivel = params.nivel;

           Grade.find({codGrado: grade.codGrado.toLowerCase()}).exec((err,grades) => {
            if(err) return res.status(500).send({
                message: 'Error en la petición del grado!'
            });

            if(grades && grades.length >= 1){
                 return res.status(200).send({
                    message: 'El grado que intentas registrar ya existe!'
                });
            } else {
                grade.save((err, gradeStored ) => {
     
                    if(err) return res.status(500).send({
                        message: 'Error al guardar el grado!'
                    });
    
                    if(gradeStored){
                        res.status(200).send({
                            grade: gradeStored
                        });
                    } else {
                        res.status(404).send({
                            message: 'No se ha registrado el grado'
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

function getGrades(req, res){
    Grade.find().sort('_id').exec((err, grades, total) => {

        if(err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if(!grades) return res.status(404).send({
            message: 'No hay grados disponibles'
        });

        return res.status(200).send({
            grades,
            total    
        });
    });
}

function getGrade(req, res){
    //datos por la url se usa params si es por post body
    var gradeId = req.params.id;
    
    Grade.findById(gradeId, (err, grade) => {
        if(err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if(!grade) return res.status(404).send({
            message: 'Grado no existe'
        });

        return res.status(200).send({
            grade
        });
    });
}


module.exports = {
    saveGrade,
    getGrades,
    getGrade
}
