'use strict'

var express = require('express');

var studentController = require('../controllers/student.js');

var api = express.Router();

var md_Auth = require('../middlewares/authenticated');

var multiPart = require('connect-multiparty');
var md_upload = multiPart({uploadDir: './uploads/users'});

api.post('/student', studentController.saveStudent);
api.get('/student/:id', md_Auth.ensureAuth, studentController.getStudent);
api.get('/students', md_Auth.ensureAuth, studentController.getStudents);

module.exports = api;