var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
    groupId: String,
    f_channel: String,
    group_name: String,
    webhook_url: String,
    associated_user: String
});

// return the model
module.exports = mongoose.model('Group', GroupSchema);