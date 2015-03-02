'use strict';

angular.module('mean.prospects').controller('ProspectsController', ['$scope', '$upload','$stateParams', '$location', 'Global', 'Prospects','Campaign',
  function($scope, $upload, $stateParams, $location,Global, Prospects, Campaign) {
    $scope.global = Global;

    $scope.prospectsdata=[];
    $scope.status = '';
    $scope.hasAuthorization = function(prospect) {
      if (!prospect || !prospect.user) return false;
      return $scope.global.isAdmin || prospect.user._id === $scope.global.user._id;
    };

    $scope.actionTemplate ='<span>' +
              '<input type="checkbox" aria-label="...">' +
              '</span>';

    $scope.headerTemplate = '<span class="gridheader"><input type="checkbox" aria-label="..."></span>';


    $scope.columns = [
            {field: 'action', displayName: '', width:10,cellTemplate: $scope.actionTemplate,headerCellTemplate:$scope.headerTemplate},
            {field: 'first_name', displayName: 'First'},
            {field: 'last_name', displayName: 'Last'},
            {field: 'title', displayName: 'Title'},
            {field: 'company', displayName: 'Company'},
            {field: 'email', displayName: 'Email'},
            {field: 'phone', displayName: 'Phone'}

    ];
    $scope.gridOptions = {
      enableSorting: true,
      data: 'prospects',
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
                    $scope.prospectsdata = data;
                    $scope.status=' uploaded successfully';


                }).error(function (data, status, headers, config){
                  console.log('data-',data,'status-',status);
                    $scope.status = ' upload failed.'
                });
            }
        }
    };

    $scope.find = function() {
      Prospects.query(function(prospects) {
        $scope.prospects = prospects;
      });
    };

     $scope.findOne = function() {
      Prospects.get({
        prospectId: $stateParams.prospectId
      }, function(prospect) {
        $scope.prospect = prospect;
      });
    };

     $scope.create = function(isValid) {
      if (isValid) {
        var prospect = new Prospects({
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email

        });
        prospect.$save(function(response) {
          $location.path('contacts/' + response._id);
        });

        this.first_name = '';
        this.last_name = '';
        this.email = '';
      } else {
        $scope.submitted = true;
      }
    };
    $scope.remove = function(prospect) {
      if (prospect) {
        prospect.$remove(function(response) {
          for (var i in $scope.prospects) {
            if ($scope.prospects[i] === prospect) {
              $scope.prospects.splice(i,1);
            }
          }
          $location.path('contacts');
        });
      } else {
        $scope.prospect.$remove(function(response) {
          $location.path('contacts');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var prospect = $scope.prospect;
        if(!prospect.updated) {
          prospect.updated = [];
        }
        prospect.updated.push(new Date().getTime());

        prospect.$update(function() {
          $location.path('contacts/' + prospect._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.runCampaign = function() {
      Campaign.runCampaign(function(res){
        console.log(res);
        $scope.campaignresults = "Success";
      },function(err){
        console.log(err);
        $scope.campaignresults = err.data.error;
      });
    }
  }
]);
