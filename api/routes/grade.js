'use strict'

var express = require('express');

var gradeController = require('../controllers/grade.js');

var api = express.Router();

var md_Auth = require('../middlewares/authenticated');

var multiPart = require('connect-multiparty');
var md_upload = multiPart({uploadDir: './uploads/users'});

api.post('/grade', gradeController.saveGrade);
api.get('/grade/:id', md_Auth.ensureAuth, gradeController.getGrade);
api.get('/grades', md_Auth.ensureAuth, gradeController.getGrades);

module.exports = api;