const BaseCtrl = require('./baseCtrl');
const Sina = require('../server/sina');

class NewsCtrl extends BaseCtrl {

    async getNews(req, res, next) {
        const msg = await Sina.getSinaInfo();
        res.send(msg);
    }
}

module.exports = new NewsCtrl();