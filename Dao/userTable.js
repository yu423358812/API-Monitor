var mongoose = require('mongoose');
var user = mongoose.Schema({
    name : String,
    cell : String,
    email : String
});

module.exports = mongoose.model('userTable', user);
