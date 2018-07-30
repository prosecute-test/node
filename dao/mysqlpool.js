const mysql = require('mysql');   // 引用mysql模块。注意要先安装mysql： npm install mysql
const dbConfig = require('../config/default');

// 数据库连接1
const mysql_pool = mysql.createPool(dbConfig.mysql_one);


// 新的数据库连接2
// const mysql_pool2 = mysql.createPool(mysqlConfig. mysql_two);


module.exports = {
    mysql_pool:mysql_pool
}