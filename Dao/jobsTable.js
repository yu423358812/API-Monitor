var mongoose = require('mongoose');
var jobs = mongoose.Schema({
    job : String,
    createdDate : { type:Date, default: Date.now },
    owner : String,
    status : { type: String, default: 'false' },
    num: String,
    summary : String
});

module.exports = mongoose.model('jobsTable', jobs);
