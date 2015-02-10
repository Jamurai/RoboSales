'use strict';

angular.module('mean.contacts').controller('ContactsController', ['$scope', '$upload','$stateParams', '$location', 'Global', 'Contacts',
  function($scope, $upload, $stateParams, $location,Global, Contacts) {
    $scope.global = Global;

    $scope.contactsdata=[];
    $scope.status = '';
    $scope.hasAuthorization = function(contact) {
      if (!contact || !contact.user) return false;
      return $scope.global.isAdmin || contact.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {


      } else {
        $scope.submitted = true;
      }
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
                    url: '/contacts/upload',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' +
                                evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' +
                                JSON.stringify(data));
                    $scope.contactsdata = data;
                    $scope.status=' uploaded successfully';


                }).error(function (data, status, headers, config){
                  console.log('data-',data,'status-',status);
                    $scope.status = ' upload failed.'
                });
            }
        }
    };


  }
]);
