'use strict';

angular.module('mean.prospects').controller('ImportController', ['$scope', '$upload','$stateParams', '$location', 'Global', 'Prospects', 'ImportHistory',
  function($scope, $upload, $stateParams, $location,Global, Prospects, ImportHistory) {
    $scope.global = Global;

    $scope.imported=[];
    $scope.status = '';
    $scope.hasAuthorization = function(prospect) {
      if (!prospect || !prospect.user) return false;
      return $scope.global.isAdmin || prospect.user._id === $scope.global.user._id;
    };


    $scope.columns = [

            {field: 'created', displayName: 'Imported Date'},
            {field: 'status', displayName: '# of Contacts'}

    ];
    $scope.gridOptions = {
      data: 'imported',
      columnDefs: $scope.columns

    };


    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                console.log(file);
                $upload.upload({
                    url: '/prospects/upload',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' +
                                evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' +
                                JSON.stringify(data));
                    $scope.imported = data;
                    $scope.status=' uploaded successfully';


                }).error(function (data, status, headers, config){
                  console.log('data-',data,'status-',status);
                    $scope.status = ' upload failed.'
                });
            }
        }
    };

    $scope.find = function() {
      ImportHistory.query(function(imported) {
        $scope.imported = imported;
      });
    };


  }
]);
