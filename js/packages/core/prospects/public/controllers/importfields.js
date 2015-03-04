'use strict';

angular.module('mean.prospects').controller('ImportFieldController', ['$scope', '$upload','$stateParams', '$location', 'Global', 'Prospects', 'ImportFields',
  function($scope, $upload, $stateParams, $location,Global, Prospects, ImportFields) {
    $scope.global = Global;

    $scope.imported=[];
    $scope.status = '';
    $scope.fields=['first_name','last_name','email'];
    $scope.hasAuthorization = function(prospect) {
      if (!prospect || !prospect.user) return false;
      return $scope.global.isAdmin || prospect.user._id === $scope.global.user._id;
    };

    $scope.field = [];
    
    var result = ImportFields.getFields();
    $scope.resultitems=[];
    try {

      console.log(result);
      var headers = result.header.split(',');
      var datas = result.sample.split(',');
      for(var i=0;i< headers.length;i++) {
        $scope.resultitems.push({
          'name':headers[i],
          'value':datas[i] || ''
        })

      }
    } catch (err) {
      console.log(err);
      alert("Invalid File Contents");
    }


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

    $scope.set = function(field) {
      console.log(field);
    }

  }
]);
