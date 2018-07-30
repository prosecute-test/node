const BaseCtrl = require('./baseCtrl');
const userDao = require('../dao/userDao');
const isEmpty = require('lodash/isEmpty')

class UserCtrl extends BaseCtrl {
    async queryUsers(req, res, next) {
        const resJson = await userDao.queryUsers(1, 5);
        res.send(resJson);
    }

    async postUser(req, res, next) {
        const user = req.body || {};
        if (isEmpty(user.username) || isEmpty(user.password) || isEmpty(user.phone)) {
            res.send({
                code: 201,
                msg: '填点啥吧，大爷~！'
            });
            return;
        }
        const resJson = await userDao.postUser(user);
        res.send(resJson);
    }

    async accesstoken(req, res, next) {
        const user = req.body || {};
        if (isEmpty(user.username) || isEmpty(user.password)) {
            res.send({
                code: 201,
                msg: '填点啥吧，大爷~！'
            });
            return;
        }
        const resJson = await userDao.accesstoken(user);
        res.send(resJson);
    }

    async delUser(req, res, next) {
        const id = req.params.id || -1;
        const resJson = await userDao.delUser(id);
        res.send(resJson);
    }
}

module.exports = new UserCtrl();