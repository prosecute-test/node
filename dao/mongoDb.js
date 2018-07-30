const mongoose = require('mongoose');
const dbConfig = require('../config/default');
mongoose.connect(dbConfig.mongo_one, {useNewUrlParser: true});

// mongoose.createConnection(dbConfig.mongo_one, {useNewUrlParser: true});

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
//
// const BlogPost = new Schema({
//     author: ObjectId,
//     title: String,
//     body: String,
//     date: Date
// });
//
// const MyModel = mongoose.model('ModelName', BlogPost);
//
// const kitty = new MyModel({title: 'title', body: ""});
//
// kitty.save((err, msg) => {
//     console.log(err);
//     console.log(msg);
// })
const db = mongoose.connection;
db.once('open', () => {
    console.log('连接数据库成功');
})

db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close', function () {
    console.log('数据库断开，重新连接数据库');
    mongoose.connect(dbConfig.mongo_one, {server: {auto_reconnect: true}});
});

module.exports = db;