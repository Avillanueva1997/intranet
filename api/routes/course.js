'use strict'

var express = require('express');

var courseController = require('../controllers/course');

var api = express.Router();

var md_Auth = require('../middlewares/authenticated');

var multiPart = require('connect-multiparty');
var md_upload = multiPart({uploadDir: './uploads/users'});

api.post('/course', courseController.saveCourse);
api.get('/course/:id', md_Auth.ensureAuth, courseController.getCourse);
api.get('/courses', md_Auth.ensureAuth, courseController.getCourses);

module.exports = api;