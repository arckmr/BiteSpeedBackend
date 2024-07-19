const express = require('express');
const router = express.Router();
const appController = require('../controller/appController');


router.get('/identify',appController.identifyAccount);

module.exports = router
