var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var async = require('async');
var request=require('request');
var endpointTable=require('./Dao/endpointTable');
var appTable=require('./Dao/appTable');
var jobsTable=require('./Dao/jobsTable');

// connect to mongodb
var configDB = require('./config/database.js');
var db=mongoose.connect(configDB.url);
db.connection.on("error", function (error) {
  console.log("database connect error：" + error);
});
db.connection.on("open", function () {
  console.log("database connect success");
});

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);




// postman function of testing Jobs only
var interval = setInterval(function() {
  jobsTable.find({},{job:1},function(err,data) {
    if(err){
      console.log(err);
    }else{
      var getJobs=data;

      getJobs.forEach(function (doc) {
        var eachJob=doc.job;
        endpointTable.find({job : eachJob},function(err,endpoints) {
          if(err){
            console.log(err);
          }else{

            // manipulate http request
            if(endpoints[0]){
              endpoints.sort(sortNumber);
              async.eachSeries(endpoints, function(endpoint, next) {
                if(endpoint.method != 'POST' && endpoint.method != 'PUT'){
                    var options = {
                      url: endpoint.url,
                      method: endpoint.method,
                      headers: endpoint.header
                    };
                }else{
                    var options = {
                      url: endpoint.url,
                      method: endpoint.method,
                      json: true,
                      headers: endpoint.header,
                      body: endpoint.body
                    };
                }

                request(options, function(error,response,body) {

                  if(!error && response.statusCode == 200){
                    endpointTable.update({_id : endpoint._id},{$set : { status : 'true',statusCode: '200' }},function(err){
                      if(err) {
                        console.log(err);
                      } else {
                        console.log('200');
                        console.log('job endpoint status success!');
                        next();
                      }
                    });
                  }else if(error){
                    endpointTable.update({_id : endpoint._id},{$set : { status : 'false',statusCode: '404' }},function(err){
                      if(err) {
                        console.log(err);
                      } else {
                        console.log('error');
                        console.log('job endpoint status error!');
                        next();
                      }
                    });
                  }else{
                    endpointTable.update({_id : endpoint._id},{$set : { status : 'false',statusCode: response.statusCode }},function(err){
                      if(err) {
                        console.log(err);
                      } else {
                        console.log(response.statusCode);
                        console.log('job endpoint status false!');
                        next();
                      }
                    });
                  }
                });
              }, function(err){
                endpointTable.findOne({ job:eachJob,status:'false'}, function (err, element){
                    if(element==null){
                        jobsTable.update({job : eachJob},{$set : { status : 'true'}}, function(err){
                          if(err) {
                            console.log(err);
                          } else {
                            console.log('Job Update success!');
                          }
                        });
                    }else{
                      jobsTable.update({job:eachJob},{$set : { status : 'false'}}, function(err){
                        if(err) {
                          console.log(err);
                        } else {
                          console.log('Job Update false!');
                        }
                      });
                    }
                });
              });
            }else{
              console.log('no endpoint belongs to the job!');
              jobsTable.update({job:eachJob},{$set : { status : 'false'}}, function(err){
                if(err) {
                  console.log(err);
                } else {
                  console.log('Job Update false!');
                }
              });
            }

            // manipulate http request end
          }
        });
      });

    }
  });
}, 30*1000);

function sortNumber(a, b)
{
  return a.sequence-b.sequence;
}




// postman function of testing Apps only
var interval = setInterval(function() {
  appTable.find({},{appName:1},function(err,data){
    if(err){
      console.log(err);
    }else{
      var getApps=data;

      getApps.forEach(function (doc) {
        var eachApp=doc.appName;
        endpointTable.find({appName : eachApp},function(err,endpoints) {
          if(err){
            console.log(err);
          }else{

            // manipulate http request
            if(endpoints[0]){
              async.each(endpoints, function(endpoint, next) {
                if(endpoint.method != 'POST' && endpoint.method != 'PUT'){
                  var options = {
                    url: endpoint.url,
                    method: endpoint.method,
                    headers: endpoint.header
                  };
                }else{
                  var options = {
                    url: endpoint.url,
                    method: endpoint.method,
                    json: true,
                    headers: endpoint.header,
                    body: endpoint.body
                  };
                }

                request(options, function(error,response,body) {

                  if(!error && response.statusCode == 200){
                    endpointTable.update({_id : endpoint._id},{$set : { status : 'true',statusCode: '200' }},function(err){
                      if(err) {
                        console.log(err);
                      } else {
                        console.log('200');
                        console.log('App endpoint status success!');
                        next();
                      }
                    });
                  }else if(error){
                    endpointTable.update({_id : endpoint._id},{$set : { status : 'false',statusCode: '404' }},function(err){
                      if(err) {
                        console.log(err);
                      } else {
                        console.log('error');
                        console.log('App endpoint status error!');
                        next();
                      }
                    });
                  }else{
                    endpointTable.update({_id : endpoint._id},{$set : { status : 'false',statusCode: response.statusCode }},function(err){
                      if(err) {
                        console.log(err);
                      } else {
                        console.log(response.statusCode);
                        console.log('App endpoint status false!');
                        next();
                      }
                    });
                  }
                });
              }, function(err){
                endpointTable.findOne({ appName:eachApp,status:'false'}, function (err, element){
                  if(element==null){
                    appTable.update({appName:eachApp},{$set : { status : 'true'}}, function(err){
                      if(err) {
                        console.log(err);
                      } else {
                        console.log('App Update success!');
                      }
                    });
                  }else{
                    appTable.update({appName:eachApp},{$set : { status : 'false'}}, function(err){
                      if(err) {
                        console.log(err);
                      } else {
                        console.log('App Update false!');
                      }
                    });
                  }
                });
              });
            }else{
              console.log('no endpoint belongs to the App!');
              appTable.update({appName:eachApp},{$set : { status : 'false'}}, function(err){
                if(err) {
                  console.log(err);
                } else {
                  console.log('App Update false!');
                }
              });
            }

            // manipulate http request end
          }
        });
      });

    }
  });
}, 30*1000);












// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
