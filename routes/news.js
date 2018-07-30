const express = require('express');
const router = express.Router();
const newsCtrl = require('../controller/newsCtrl');

/* GET http */
router.get('/', newsCtrl.getNews);

module.exports = router;
