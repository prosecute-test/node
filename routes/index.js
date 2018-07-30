const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    res.send({message: req.decoded._doc.name + '  欢迎使用API'});
});

module.exports = router;
