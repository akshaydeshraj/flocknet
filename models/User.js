var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    userToken: String,
    token: String,
    name: Number,
    userid: String
});

// return the model
module.exports = mongoose.model('User', UserSchema);