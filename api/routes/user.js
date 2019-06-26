'use strict'

var express = require('express');

var userController = require('../controllers/user');

var api = express.Router();

var md_Auth = require('../middlewares/authenticated');

var multiPart = require('connect-multiparty');
var md_upload = multiPart({uploadDir: './uploads/users'});

api.get('/home', userController.home);

api.get('/pruebas', md_Auth.ensureAuth, userController.pruebas);

api.post('/register', userController.saveUser);

api.post('/login',  userController.loginUser);

//:id => asigna el id ; ? declara que es opcional

api.get('/user/:id', md_Auth.ensureAuth, userController.getUser);

api.get('/users/:page?', md_Auth.ensureAuth, userController.getUsers);

api.get('/counters/:id?', md_Auth.ensureAuth, userController.getCounters);

api.put('/updateUser/:id', md_Auth.ensureAuth, userController.updateUser);

api.post('/uploadImageUser/:id', [md_Auth.ensureAuth, md_upload], userController.uploadImage);

api.get('/getImageUser/:imageFile', userController.getImageFile);

module.exports = api;