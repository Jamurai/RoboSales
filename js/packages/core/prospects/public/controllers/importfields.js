'use strict';

angular.module('mean.prospects').controller('ImportFieldController', ['$scope', '$upload','$state','$stateParams', '$location', 'Global', 'Prospects', 'ImportFields',
  function($scope, $upload, $state, $stateParams, $location,Global, Prospects, ImportFields) {
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
    var files = ImportFields.getFiles();
    $scope.resultitems=[];
    var headers;
    try {

      console.log(result);
      headers = result.header.split(',');
      var datas = result.sample.split(',');
      for(var i=0;i< headers.length;i++) {
        $scope.resultitems.push({
          'name':headers[i],
          'value':datas[i] || ''
        })

      }
    } catch (err) {
      console.log(err);
      alert("Invalid File Contents" + err);
    }


    $scope.upload = function () {
        $scope.loader = true;
        var remap = {};
        for (var i = 0; i < $scope.field.length; i++){
          if($scope.field[i]) {
              remap[headers[i]] = $scope.field[i];
          }
        }
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                console.log(file);
                $upload.upload({
                    url: '/prospects/upload',
                    file: file,
                    fields: {'remap': remap},
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' +
                                evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' +
                                JSON.stringify(data));
                    $scope.imported = data;
                    $scope.status=' uploaded successfully';
                    $scope.loader=false;
                    $state.go('import');


                }).error(function (data, status, headers, config){
                  console.log('data-',data,'status-',status);
                    $scope.status = ' upload failed.'
                    $scope.loader=false;
                    $state.go('import');
                });
            }
        }
    };

  }
]);
