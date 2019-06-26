'use strict'

var express = require('express');

var MessageController = require('../controllers/message');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);

api.get('/myMessages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);

api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmmitMessages);

api.get('/unviewedMessages', md_auth.ensureAuth, MessageController.getUnviewedMessages);

api.get('/setViewedMessages', md_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;

