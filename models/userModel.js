const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        index: true,
        unique: true
    },
    user_name: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    phone: String, // 手机
    tokenp: String,// pc
    tokenm: String,// 移动
    role_id: {type: String, default: '1'},
    create_time: {
        type: Date,
        default: Date.now,
        get: v => new Date(v).getTime(),
        set: v => new Date(v)
    },
    avatar: {type: String, default: 'default.jpg'}, // 头像
    email: {type: String, default: ''}, // 邮箱
    city: {type: String, default: '成都'}, // 所在地
});

// 添加用户保存时中间件对password进行bcrypt加密,这样保证用户密码只有用户本人知道
userSchema.pre('save', function (next) {
    var _self = this;
    if (_self.isModified('password') || _self.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(_self.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                _self.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
// 校验用户输入密码是否正确
userSchema.methods.comparePassword = function (pasword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pasword, this.password, (err, isMatch) => {
            if (err || !isMatch) {
                reject(err);
            }
            resolve(isMatch);
        });
    });
};

const userModel = mongoose.model('User', userSchema);


module.exports = userModel;