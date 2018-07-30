// create table user_info (user_id int not null auto_increment,username varchar(40) not null,password varchar(40),phone varchar(20) not null,primary key (user_id))
const BaseDao = require('./BaseDao');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken'); // 使用jwt签名
const config = require('../config/default')

class UserDao extends BaseDao {
    constructor() {
        super();
        this.queryUsers = this.queryUsers.bind(this);
        this.queryUser = this.queryUser.bind(this);
    }

    async queryUsers(pageIndex, pageSize = this.pageSize, key = '') {
        let q_users = "select * from user_info  ";
        let q_total = "select count(*) as total from user_info";
        if (key) {
            q_users += `WHERE username like '%a%' `;
            q_total += `WHERE username like '%a%' `;
        }
        q_users += 'order by user_id limit ?,?';
        try {
            const rows = await this.query(q_users, [(pageIndex - 1) * pageSize, pageSize]);
            const total = await this.query(q_total);
            console.log(total);
            // res.status(404).end();
            return {
                code: 200,
                msg: 'ok',
                data: rows,
                total: total[0]['total']
            };
        } catch (e) {
            return {
                code: 200,
                msg: "err:" + e,
            }
        }
    }

    queryUser(id) {
    }

    async postUser(user = {}) {
        // const sql = "insert into user_info (username,password,phone)value(?,?,?);";
        // try {
        //     const rows = await super.query(sql, [user.username, user.password, user.phone]);
        //     return {
        //         code: 200,
        //         msg: 'ok'
        //     };
        // } catch (e) {
        //     return {
        //         code: 200,
        //         msg: "err:" + e,
        //     }
        // }
        try {
            const user_id = await this.getId('user_id');
            const kitty = {user_id: user_id, user_name: user.username, password: user.password, phone: user.phone};
            const res = await userModel.create(kitty);
            return {
                code: 200,
                msg: 'ok'
            };
        } catch (e) {
            return {
                code: 200,
                msg: "err:" + e,
            }
        }
    }

    putUser(user) {
    }

    async delUser(id = -1) {
        const sql = "delete from user_info where user_id=?;";
        try {
            const rows = await super.query(sql, [id]);
            return {
                code: 200,
                msg: 'ok'
            };
        } catch (e) {
            return {
                code: 200,
                msg: "err:" + e,
            };
        }
    }

    async accesstoken(user = {}) {
        try {
            const userInfo = await userModel.findOne({user_name: user.username});
            const isMatch = await userInfo.comparePassword(user.password);
            console.log(isMatch);
            // 判断是手机还是pc
            const token_code = jwt.sign({
                username: userInfo.user_name, user_id: userInfo.user_id, loginType: user.loginType
            }, config.jwtsecret, {
                expiresIn: config.timeOut // 失效时间
            });
            const key = user.loginType === 'p' ? 'tokenp' : 'tokenm';
            debugger
            userInfo[key] = token_code;
            const {user_name, phone, user_id} = await userInfo.save();
            return {
                code: 200,
                msg: 'ok',
                user_name,
                user_id,
                phone,
                token: token_code
            }
        } catch (e) {
            return {code: 403, msg: '未找到授权用户'}
        }
    }

    // async accesstoken(user = {}) {
    //     try {
    //         const userInfo = await userModel.findOne({user_name: user.username});
    //         const isMatch = await userInfo.comparePassword(user.password);
    //         console.log(isMatch);
    //         const token_code = jwt.sign({
    //             username: userInfo.user_name, user_id: userInfo.user_id
    //         }, config.jwtsecret, {
    //             expiresIn: config.timeOut // 失效时间
    //         });
    //         const {user_name, phone, user_id} = userInfo;
    //         return {
    //             code: 200,
    //             msg: 'ok',
    //             user_name,
    //             user_id,
    //             phone,
    //             token: token_code
    //         }
    //     } catch (e) {
    //         return {code: 403, msg: '未找到授权用户'}
    //     }
    // }

}

module.exports = new UserDao();