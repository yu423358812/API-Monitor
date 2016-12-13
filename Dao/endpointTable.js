var mongoose = require('mongoose');
var endpoints = mongoose.Schema({
        appName: String,
        job : String,
        owner : String,
        sequence: String,
        summary: String,
        url: String,
        path: String,
        method: String,
        port:String,
        contact: String,
        contactNo: String,
        contactEmail: String,
        status: String,
        statusCode: String,
        header: String,
        body: String,
        response : String,
        created: Date,
        lastUpdated: Date,
        isJson: String,
        switch: String
});

module.exports = mongoose.model('endpointTable', endpoints);