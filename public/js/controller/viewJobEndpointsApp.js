var viewJobEndpointsApp = angular.module('viewJobEndpointsApp', []);

viewJobEndpointsApp.controller('mainController', function($scope, $http, $interval,$rootScope){

    $scope.endpoints='';
    $scope.manipulateApi='';
    $scope.setEditApi= '';

    $http.get("/ngViewJobEndpoints")
        .then(function(response) {
            $scope.endpoints=response.data;
            console.log(response.data);
        });

    // pass delete Api
    $scope.passDeleteApi=function (list){
        $scope.manipulateApi=list;
    };
    // delete Api
    $scope.deleteApi=function (manipulateApi) {
        $http({
            url:'/deleteJobApi',
            method:'post',
            data: { data: manipulateApi}
        }).success(function (data) {
            if(data=='success'){
                var t=($scope.endpoints).indexOf(manipulateApi);
                $scope.endpoints.splice(t,1);
            }
        }).error(function (data) {
            console.log(data);
        })
    };

    // pass edit Api
    $scope.passEditApi=function (list){
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
        $scope.setEditApi=list;
    };
    // edit Api
    $scope.editApi=function (editApi) {
        $http({
            url:'/editApi',
            method:'post',
            data: { data: editApi}
        }).success(function (data) {
            if(data=='success'){
                $http.get("/ngViewJobEndpoints")
                    .then(function(response) {
                        $scope.endpoints=response.data;
                        console.log(response.data);
                    });
            }
        }).error(function (data) {
            console.log(data);
        })
    };
    // change the status picture
    $scope.changeStatus=function (status) {
        if(status=='true'){
            return 'glyphicon glyphicon-ok-circle status-true';
        }else{
            return 'glyphicon glyphicon-remove-circle status-false'
        }

    };

});
