'use strict';

angular.module('mean.prospects').controller('ImportController', ['$scope', '$upload','$state','$stateParams', '$location', 'Global', 'Prospects', 'ImportHistory','ImportFields',
  function($scope, $upload, $state, $stateParams, $location,Global, Prospects, ImportHistory,ImportFields) {
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
        //$scope.upload($scope.files);
        $scope.readFile($scope.files);
    });


    $scope.readFile = function(files) {

      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var reader = new FileReader();
          reader.onload = function(progressEvent){
            // Entire file
                      // By lines
            var lines = this.result.split('\n');
            if(lines && lines.length > 1) {
              var result = {
                'header':lines[0] || '',
                'sample':lines[1] || ''
              }

              ImportFields.setFields(result);

              $state.go('importfields');


            } else {
              alert("Invalid File");
            }
            /*
            for(var line = 0; line < lines.length; line++){
              console.log(lines[line]);
            }*/
          };
          reader.readAsText(file);
        }
      }

    };

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
