'use strict'

//Variable mongoose para conectar a mongoDB

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//Conexion DB

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/redSocial', {useMongoClient: true })
mongoose.connect('mongodb://localhost:27017/intranet', {useNewUrlParser: true})
.then(()=>{
    console.log('Conexión exitosa!!');
    //Crear Servidor
    app.listen(port, ()=>{
        console.log('Servidor corriendo en http://localhost:3800');
    });
})
.catch(err => console.log(err));



