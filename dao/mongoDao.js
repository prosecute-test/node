const mongoose = require('mongoose');
const dbconfig = require('../config/default');

mongoose.connect(dbconfig.mongo_one, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("open")
});

var kittySchema = new mongoose.Schema({
    name: String,
    age: String
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
    var greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
    console.log(greeting);
}

var Kitten = mongoose.model('foosd', kittySchema,'foo');

var silence = new Kitten({name: 'Silence', age: '18'});
console.log(silence.name); // 'Silence'
silence.speak(); // "Meow name is fluffy"


silence.save(function (err, fluffy) {
    if (err) return console.error(err);
    fluffy.speak();
});


setTimeout(function () {
    Kitten.find(function (err, kittens) {
        if (err) return console.error(err);
        console.log(kittens);
    })
}, 2000)