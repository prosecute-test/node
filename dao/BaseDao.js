var mysql = require('./mysqlpool');    // 获取数据库连接配置
const idsModel = require('../models/IdsModel');

// 先写在这里
class BaseDao {
    constructor() {
        this.pageSize = 10;
        this.idList = ['user_id','role_id','menu_id'];
    }

    // 返回一个 Promise
    query(sql, values) {
        return new Promise((resolve, reject) => {
            mysql.mysql_pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {

                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        // 结束会话
                        connection.release()
                    })
                }
            })
        })
    }

    //获取id列表
    async getId(type){
        if (!this.idList.includes(type)) {
            console.log('id类型错误');
            throw new Error('id类型错误');
            return
        }
        try{
            const idData = await idsModel.findOne();
            idData[type] ++ ;
            await idData.save();
            return idData[type]
        }catch(err){
            console.log('获取ID数据失败');
            throw new Error(err)
        }
    }
}

module.exports = BaseDao;