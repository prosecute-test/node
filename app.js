const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config/default');
const jwt = require('jsonwebtoken'); // 使用jwt签名
// const expressJWT = require('express-jwt');
const userModel = require('./models/userModel');
// const md5 = require("md5");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const newsRouter = require('./routes/news');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//拦截器
app.use(function (req, res, next) {
    const url = req.originalUrl;
    if (url != "/users/postUser" && url != "/users/accesstoken") {
        return authed(req, res, next);
        // return autheded(req, res, next);
    }
    next();
});

// app.use(expressJWT({
//     secret: config.jwtsecret
// }).unless({
//     path: ['/users/addUser','/users/postUser','/users/login']  //除了这个地址，其他的URL都需要验证
// }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/news', newsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// 先校验然后 数据库二次判断是否有效
const authed = (req, res, next) => {
    // 拿取token 数据 按照自己传递方式写
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        // 解码 token (验证 secret 和检查有效期（exp）)
        jwt.verify(token, config.jwtsecret, function (err, decoded) {
            if (err) {
                return res.status(403).send({code: 403, msg: '没有访问权限'});
            } else {
                // 支持手机和pc同时登陆
                const param = decoded.loginType === 'p' ? {tokenp: token} : {tokenm: token};
                userModel.findOne(param, (err, user) => {
                    if (err || !user) {
                        return res.status(403).send({code: 403, msg: '没有访问权限'});
                    }
                    req.decoded = decoded;
                    next();
                });
            }
        });
    } else {
        // 没有拿到token 返回错误
        return res.status(403).send({code: 403, msg: '没有访问权限'});
    }
};

// 拿到 sessionId 和 token 一起校验
// const autheded = (req, res, next) => {
//     const token = req.body.token || req.query.token || req.headers['x-access-token'];
//     const sessionId = req.headers['session-id'];
//     if (token) {
//         // 解码 token (验证 secret 和检查有效期（exp）)
//         jwt.verify(token, config.jwtsecret, function (err, decoded) {
//             if (err) {
//                 return res.status(403).send({code: 403, msg: '没有访问权限'});
//             } else { // token 有效时候 验证sessionId
//                 debugger
//                 const url = req.originalUrl;
//                 let str = md5(`${url}${decoded.username}${decoded.user_id}${token}`);
//                 if (str === sessionId) {
//                     // 验证通过，在req中写入解密结果
//                     req.decoded = decoded;
//                     next(); //继续下一步路由
//                 } else {
//                     // 验证不通过
//                     return res.status(403).send({code: 403, msg: '没有访问权限'});
//                 }
//             }
//         });
//     } else {
//         // 没有拿到token 返回错误
//         return res.status(403).send({code: 403, msg: '没有访问权限'});
//     }
// };

module.exports = app;
