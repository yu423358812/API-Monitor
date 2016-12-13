var mongoose = require('mongoose');
var apps = mongoose.Schema({
    appName : String,
    owner : String,
    status: { type: String, default: 'false' },
    num: String,
    createDate : Date
});

module.exports = mongoose.model('appTable', apps);
