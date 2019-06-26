//CONFIGURAR EL SERVIDOR WEB EXPRESS

'use strict'

//CARGA EL MODULO EXPRESS
var express = require('express');

//CONVERTIR LAS PETICIONES JSON EN UN OBJETO JS
var bodyParser = require('body-parser');

//INSTANCIA DE EXPRESS
var app = express();

//CARGAR RUTAS

var user_routes = require('./routes/user');

var follow_routes = require('./routes/follow');

var publication_routes = require('./routes/publication');

var message_routes = require('./routes/message');

var course_routes = require('./routes/course');

var grade_routes = require('./routes/grade');

var student_routes = require('./routes/student');

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


//RUTAS

app.use('/', user_routes);

app.use('/', follow_routes);

app.use('/', publication_routes);

app.use('/', message_routes);

app.use('/', course_routes);

app.use('/', grade_routes);

app.use('/', student_routes);

//EXPORTAR LA CONFIGURACION

module.exports = app;



