'use strict'

var bcrypt = require('bcrypt-nodejs');

var mongoosePaginate = require('mongoose-pagination');

var fs = require('fs');

var path = require('path');

//PRIMERA LETRA CON MAYUSCULA PARA IDENTIFICAR QUE ES UN MODELO
var Student = require('../models/student');

var jwt = require('../services/jwt');


function saveStudent(req, res){
    var params = req.body;
    var student = new Student();

    if(params.name && params.fLastName && 
       params.mLastName && params.gender && 
       params.fechaNac && params.dni &&
       params.direccion && params.telefono &&
       params.email){

           student.name = params.name;
           student.fLastName = params.fLastName;
           student.mLastName = params.mLastName;
           student.gender = params.gender;
           student.fechaNac = params.fechaNac;
           student.dni = params.dni;
           student.direccion = params.direccion;
           student.telefono = params.telefono;
           student.email = params.email;

           let password = 'a' + params.dni + '0';


           Student.find({ $or:[
                {dni: student.dni.toLowerCase()},
                {email: student.email.toLowerCase()}
           ]}).exec((err,students) => {
            if(err) return res.status(500).send({
                message: 'Error en la petición del usuario!'
            });

            if(students && students.length >= 1){
                 return res.status(200).send({
                    message: 'El alumno que intentas registrar ya existe'
                });
            } else {
                bcrypt.hash(password, null, null, (err, hash)=>{
                    student.password = hash;
     
                    student.save((err, studentStored ) => {
     
                     if(err) return res.status(500).send({
                         message: 'Error al guardar el alumno!'
                     });
     
                     if(studentStored){
                         res.status(200).send({
                             student: studentStored
                         });
                     } else {
                         res.status(404).send({
                             message: 'No se ha registrado el alumno'
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

function getStudents(req, res){
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

function getStudent(req, res){
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
    saveStudent,
    getStudents,
    getStudent
}
