var express = require('express');
var router = express.Router();
var fs = require("fs");
var https=require('https');
var async = require("async");
var request=require('request');
// mongodb model
var endpointTable=require('../Dao/endpointTable');
var appTable=require('../Dao/appTable');
var jobsTable=require('../Dao/jobsTable');
var userTable=require('../Dao/userTable');


// home.ejs
router.get('/', function(req, res){
            res.render("index");
});

// show apps and owners status
router.get('/ngShowApp', function(req, res){
    appTable.find({},function(err,data){
        if(err){
            console.log(err);
        }else{
            var apps=data;
            async.each(apps,
                function(app, callback){
                    endpointTable.find({ appName: app.appName } ,function (err,data){
                        if(err){ console.log(err); }else{
                            appTable.update({ appName: app.appName },{$set : { num : data.length }}, function(err){
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log('Update num success!');
                                }
                            });
                            app.num=data.length;
                            callback();
                        }
                    });
                },
                function(err){
                    res.send(JSON.stringify(apps));
                }
            );
        }
    });
});

// show jobs and owners status
router.get('/ngShowJobs', function(req, res){
    jobsTable.find({},function(err,data){
        if(err){
            console.log(err);
        }else{
            var jobs=data;
            async.each(jobs,
                function(job, callback){
                    endpointTable.find({ job: job.job } ,function (err,data){
                        if(err){ console.log(err); }else{
                            jobsTable.update({ job: job.job },{$set : { num : data.length }}, function(err){
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log('Update num success!');
                                }
                            });
                            job.num=data.length;
                            callback();
                        }
                    });
                },
                function(err){
                    res.send(JSON.stringify(jobs));
                }
            );
        }
    });
});

// add App
router.post('/ngCreateApp', function(req, res){
    var addApp=req.body.data;
    appTable.create(addApp, function(err,data){
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
});

// add Job
router.post('/ngCreateJob', function(req, res){
    var addJob=req.body.data;
    console.log(addJob);
    jobsTable.create(addJob, function(err,data){
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
});

// delete App
router.post('/deleteApp', function(req, res){
        var deleteAppId=req.body.data._id;
        appTable.remove({_id : deleteAppId }, function(err){
            if(err) {
                console.log(err);
            } else {
                if(req.body.data.job == null){
                    endpointTable.remove({appName : req.body.data.appName,job : '' }, function(err){
                        if(err) {
                            console.log(err);
                        } else {
                            res.send('success');
                        }
                    });
                }else{
                    endpointTable.update({appName : req.body.data.appName,job : req.body.data.job},{$set : {appName:''}}, function(err){
                        if(err) {
                            console.log(err);
                        } else {
                            res.send('success');
                        }
                    });
                }
            }
        });
});

// delete Job
router.post('/deleteJob', function(req, res){
    var deleteJobId=req.body.data._id;
    jobsTable.remove({_id : deleteJobId }, function(err){
        if(err) {
            console.log(err);
        } else {
            if(req.body.data.appName == null){
                endpointTable.remove({job : req.body.data.job,appName : '' }, function(err){
                    if(err) {
                        console.log(err);
                    } else {
                        res.send('success');
                    }
                });
            }else{
                endpointTable.update({appName : req.body.data.appName,job : req.body.data.job},{$set : {job:''}}, function(err){
                    if(err) {
                        console.log(err);
                    } else {
                        res.send('success');
                    }
                });
            }
        }
    });
});

// add User
router.post('/ngCreateUser', function(req, res){
    var addUser=req.body.data;
    userTable.create(addUser, function(err,data){
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
});
// get createUser Modal Info
router.get('/ngGetUsers', function(req, res){
    userTable.find({},{_id:1 , name:1},function(err,data){
        if(err) {
            console.log(err);
        } else {
            res.send(JSON.stringify(data));
        }
    })
});
// get createApps Modal Info
router.get('/ngGetApps', function(req, res){
    appTable.find({},{_id:1 , appName:1},function(err,data){
        if(err) {
            console.log(err);
        } else {
            res.send(JSON.stringify(data));
        }
    })
});
// get createApps Modal Info
router.get('/ngGetJobs', function(req, res){
    jobsTable.find({},{_id:1 , job:1},function(err,data){
        if(err) {
            console.log(err);
        } else {
            res.send(JSON.stringify(data));
        }
    })
});

//jump to appEndpointsView page
router.post('/viewAppEndpoints', function(req, res){
    res.cookie('appEndpoint', req.body.data);
    res.send('success');
});
router.get('/ngViewApp', function(req, res){
    res.render('viewAppEndpoints');
});
router.get('/ngViewAppEndpoints', function(req, res){
    var viewApp=req.cookies.appEndpoint;

    endpointTable.find({ appName: viewApp.appName }, function (err, data) {
        if(err){
            console.log("err :" + err);
        }else{
            res.send(JSON.stringify(data));
        }
    });
});

//jump to jobEndpointsView page
router.post('/viewJobEndpoints', function(req, res){
    res.cookie('jobEndpoint', req.body.data);
    res.send('success');
});
router.get('/ngViewJobs', function(req, res){
    res.render('jobEndpoints');
});
router.get('/ngViewJobEndpoints', function(req, res){
    var viewJob=req.cookies.jobEndpoint;

    endpointTable.find({ job: viewJob.job }, function (err, data) {
        if(err){
            console.log("err :" + err);
        }else{
            res.send(JSON.stringify(data));
        }
    });
});





// ------------------------------------------------






// delete App's APi
router.post('/deleteAppApi', function(req, res){
    var endpoint=req.body.data;
    var eachJob=endpoint.job;
    var eachApp=endpoint.appName;
    if(req.body.data.job==''){
        endpointTable.remove({_id : req.body.data._id }, function(err){
            if(err) {
                console.log(err);
            } else {
                refresh(eachJob,eachApp,res);
            }
        });
    }else{
        endpointTable.update({_id : req.body.data._id },{$set : { appName : '' }}, function(err){
            if(err) {
                console.log(err);
            } else {
                refresh(eachJob,eachApp,res);
            }
        });
    }
});
// delete Job's APi
router.post('/deleteJobApi', function(req, res){
    var endpoint=req.body.data;
    var eachJob=endpoint.job;
    var eachApp=endpoint.appName;
    if(req.body.data.appName==''){
        endpointTable.remove({_id : req.body.data._id }, function(err){
            if(err) {
                console.log(err);
            } else {
                refresh(eachJob,eachApp,res);
            }
        });
    }else{
        endpointTable.update({_id : req.body.data._id },{$set : { job : '' }}, function(err){
            if(err) {
                console.log(err);
            } else {
                refresh(eachJob,eachApp,res);
            }
        });
    }
});
// Edit APi
router.post('/editApi', function(req, res){
    var editApi=req.body.data;
    var eachJob=editApi.job;
    var eachApp=editApi.appName;
    endpointTable.update({_id : editApi._id}, {$set : editApi}, function(err){
        if(err) {
            console.log(err);
        } else {
            refresh(eachJob,eachApp,res);
        }
    });

});

// add Api
router.post('/ngCreateApi', function(req, res){
    var endpoint=req.body.data;
    var eachJob=endpoint.job;
    var eachApp=endpoint.appName;
    endpointTable.create(endpoint, function(err,data) {
        if(err) {
            console.log(err);
        } else {
            refresh(eachJob,eachApp,res);
        }
    });
});

function sortNumber(a, b)
{
    return a.sequence-b.sequence;
}

function refresh(eachJob,eachApp,res) {
    if (eachApp == '') {
        endpointTable.find({job: eachJob}, function (err, endpoints) {
            if (err) {
                console.log(err);
            } else {
                // manipulate http request
                endpoints.sort(sortNumber);
                async.eachSeries(endpoints, function (endpoint, next) {
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
                }, function (err) {
                    endpointTable.findOne({job: eachJob, status: 'false'}, function (err, element) {
                        if (element == null) {
                            jobsTable.update({job: eachJob}, {$set: {status: 'true'}}, function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Job Update success!');
                                    res.send("success");
                                }
                            });
                        } else {
                            jobsTable.update({job: eachJob}, {$set: {status: 'false'}}, function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Job Update false!');
                                    res.send("success");
                                }
                            });
                        }
                    });
                });

                // manipulate http request end
            }
        });
    } else {
        endpointTable.find({appName: eachApp}, function (err, endpoints) {
            if (err) {
                console.log(err);
            } else {
                // manipulate http request
                async.each(endpoints, function (endpoint, next) {
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
                }, function (err) {
                    endpointTable.findOne({appName: eachApp, status: 'false'}, function (err, element) {
                        if (element == null) {
                            appTable.update({appName: eachApp}, {$set: {status: 'true'}}, function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('App Update success!');
                                    res.send("success");
                                }
                            });
                        } else {
                            appTable.update({appName: eachApp}, {$set: {status: 'false'}}, function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('App Update false!');
                                    res.send("success");
                                }
                            });
                        }
                    });
                });

                // manipulate http request end
            }
        });
    }
}


























module.exports = router;
