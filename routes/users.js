const express = require('express');
const router = express.Router();
const userDao = require('../dao/userDao');
const userCtrl = require('../controller/userCtrl');

/* GET users listing. */
router.get('/', userCtrl.queryUsers);
router.get('/addUser', (req, res, next) => {
    res.render('addUser', { title: '添加用户' });
});
router.post('/postUser', userCtrl.postUser);
router.post('/accesstoken', userCtrl.accesstoken);
router.get('/delUser/:id', userCtrl.delUser);

module.exports = router;
