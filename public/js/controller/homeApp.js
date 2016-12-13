var homeApp = angular.module('homeApp', []);

homeApp.controller('mainController', function($scope, $http, $interval,$window){
    $scope.showApps = '';
    $scope.showJobs= '';
    $scope.addApp={
        appName:'',
        num:'',
        owner:''
    };
    $scope.addJob={
        job : '',
        developer : '',
        num: '',
        summary : ''
    };
    $scope.addUser={
        name:'',
        cell:'',
        email:''
    };
    $scope.addApi={
        appName: '',
        job : '',
        owner : '',
        sequence: '',
        summary: '',
        url: '',
        path: '',
        method: '',
        port:'',
        contact: '',
        contactNo: '',
        contactEmail: '',
        status: '',
        statusCode: '',
        header: '',
        body: '',
        response : '',
        created: '',
        lastUpdated: '',
        isJson: '',
        switch: 'on'
    };
    $scope.manipulateApp='';
    $scope.manipulateJob='';
    $scope.users='';
    $scope.apps='';
    $scope.jobs='';
    // block input
    $scope.blockApp='';
    $scope.blockJob='';
    $scope.blockSeq='';
    // Timer
    $scope.timer=60;

    // show all Apps
    $http.get("/ngShowApp")
        .then(function(response) {
            $scope.showApps = response.data;
        });

    // show all Jobs
    $http.get("/ngShowJobs")
        .then(function(response) {
            $scope.showJobs = response.data;
            console.log(response.data);
        });

    // create App
    $scope.createApp=function () {
        $http.post("/ngCreateApp",{data:$scope.addApp}).success(function (response) {
            if(response=='success'){
                // $scope.addApp='';
                $http.get("/ngShowApp")
                    .then(function(response) {
                        $scope.showApps = response.data;
                        console.log(response.data);
                    });
            }
        })
    };

    // createJob
    $scope.createJob=function () {
        $http.post("/ngCreateJob",{data:$scope.addJob}).success(function (response) {
            if(response=='success'){
                // $scope.addJob='';
                $http.get("/ngShowJobs")
                    .then(function(response) {
                        $scope.showJobs = response.data;
                        console.log(response.data);
                });
            }
        })
    };


    // create Api
    $scope.createApi=function () {
        if($scope.addApi.appName == '' && $scope.addApi.job == ''){ console.log('must type something') }else{
            $http.post("/ngCreateApi",{data:$scope.addApi}).success(function (response) {
                if(response=='success'){
                    $http.get("/ngShowApp")
                        .then(function(response) {
                            $scope.showApps = response.data;
                            console.log(response.data);
                        });
                    $http.get("/ngShowJobs")
                        .then(function(response) {
                            $scope.showJobs = response.data;
                            console.log(response.data);
                        });
                }
            })
        }
    };

    // pass delete App
    $scope.passDeleteApp=function (list){
        $scope.manipulateApp=list;
    };
    // delete App
    $scope.deleteApp=function (manipulateApp) {
        $http({
            url:'/deleteApp',
            method:'post',
            data: { data: manipulateApp}
        }).success(function (data) {
            if(data=='success'){
                var t=($scope.showApps).indexOf(manipulateApp);
                $scope.showApps.splice(t,1);
            }
        }).error(function (data) {
            console.log(data);
        })
    };
    // pass delete Job
    $scope.passDeleteJob=function (list){
        $scope.manipulateJob=list;
    };
    // delete Job
    $scope.deleteJob=function (manipulateJob) {
        $http({
            url:'/deleteJob',
            method:'post',
            data: { data: manipulateJob}
        }).success(function (data) {
            if(data=='success'){
                var t=($scope.showJobs).indexOf(manipulateJob);
                $scope.showJobs.splice(t,1);
            }
        }).error(function (data) {
            console.log(data);
        })
    };
    // create user
    $scope.createUser=function () {
        $http.post("/ngCreateUser",{data:$scope.addUser}).success(function (response) {
            if(response=='success'){
                $scope.addUser={
                    name:'',
                    cell:'',
                    email:''
                };
            }
        })
    };
    // click createApp Modal,and get select infos
    $scope.getCreateAppInfo=function (){
        $http.get("/ngGetUsers").success(function (response) {
            console.log(response);
            $scope.users=response;
        })
    };
    // click createJob Modal,and get select infos
    $scope.getCreateJobInfo=function (){
        $http.get("/ngGetUsers").success(function (response) {
            $scope.users=response;
        });
    };
    // click createApi Modal,and get select infos
    $scope.getCreateApiInfo=function (){
        $http.get("/ngGetUsers").success(function (response) {
            $scope.users=response;
        });
        $http.get("/ngGetApps").success(function (response) {
            $scope.apps=response;
            console.log(response);
        });
        $http.get("/ngGetJobs").success(function (response) {
            $scope.jobs=response;
        });
    };

    // jump to view app endpoints
    $scope.appEndpointsView=function (showApp){
        console.log(showApp);
        $http.post("/viewAppEndpoints", { data:showApp }).success(function (response) {
            if(response=='success'){
                $window.location='/ngViewApp';
            }
        });
    };
    // jump to view job endpoints
    $scope.jobEndpointsView=function (showJob){
        console.log(showJob);
        $http.post("/viewJobEndpoints", { data:showJob }).success(function (response) {
            if(response=='success'){
                $window.location='/ngViewJobs';
            }
        });
    };

    // change the status picture
    $scope.changeStatus=function (status) {
        if(status=='true'){
            return 'glyphicon glyphicon-ok-circle status-true';
        }else{
            return 'glyphicon glyphicon-remove-circle status-false'
        }

    };

    // block inputs
    $scope.$watch('addApi.appName',function (data) {
        if(data != ''){
            $scope.blockJob='true';
            $scope.blockSeq='true';
        }else{
            $scope.blockJob='';
            $scope.blockSeq='';
        }
    });
    $scope.$watch('addApi.job',function (data) {
        if(data != ''){
            $scope.blockApp='true';
        }else{
            $scope.blockApp='';
        }
    });
    $scope.$watch('addApi.sequence',function (data) {
        if(data != ''){
            $scope.blockApp='true';
        }else{
            $scope.blockApp='';
        }
    });

    // Timer for refreshing
    $interval(function() {
        $scope.timer=$scope.timer-1;
        while($scope.timer==0){
            $http.get("/ngShowApp")
                .then(function(response) {
                    $scope.showApps = response.data;
                    console.log(response.data);
                });
            $http.get("/ngShowJobs")
                .then(function(response) {
                    $scope.showJobs = response.data;
                    console.log(response.data);
                });
            $scope.timer=60;
        }
    }, 1000);
});


