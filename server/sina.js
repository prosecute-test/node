const fetch = require('node-fetch');

class sinahttp {
    constructor() {
        this.url = 'https://www.sojson.com/api/gongan/sina.com.cn';
    }

    async getSinaInfo() {
        let responseJson;
        try {
            const response = await fetch(this.url);
            responseJson = await response.json();
        } catch (e) {
            responseJson = {
                code: 500,
                msg: "获取http数据失败:" + e
            }
        }
        return responseJson;
    }
}

module.exports = new sinahttp();