'use strict';

angular.module('mean.prospects').controller('FiltersController', ['$scope','$stateParams', '$location', 'Global','Filters',
  function($scope,$stateParams, $location,Global,Filters) {
    $scope.global = Global;

    $scope.status = '';
    $scope.options = ['1','2','3'];
    $scope.optionselection = [];
    $scope.operators = ['equals','not equal to','starts with','contains','does not contain','less than','greater than'];
    $scope.fields = ['first_name','last_name','email','created'];


    $scope.find = function() {
      Filters.query(function(filters) {
        $scope.filters = filters;
      });
    };

     $scope.findOne = function() {
      Filters.get({
        filterId: $stateParams.filterId
      }, function(filter) {
        $scope.filter = filter;
      });
    };


     $scope.create = function(isValid) {
       console.log($scope.optionselection);
      if (isValid) {
        var filter = new Filters({
          name: this.filtername,
          filterset: $scope.optionselection

        });
        filter.$save(function(response) {
          $location.path('contacts');
        });

        this.filtername = '';
        this.filterset = '';

      } else {
        $scope.submitted = true;
      }
    };
    $scope.remove = function(filter) {
      if (filter) {
        filter.$remove(function(response) {
          for (var i in $scope.filters) {
            if ($scope.filters[i] === filter) {
              $scope.filters.splice(i,1);
            }
          }
          $location.path('contacts/');
        });
      } else {
        $scope.filter.$remove(function(response) {
          $location.path('contacts');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var filter = $scope.filter;
        if(!filter.updated) {
          filter.updated = [];
        }
        filter.updated.push(new Date().getTime());

        filter.$update(function() {
          $location.path('contacts');
        });
      } else {
        $scope.submitted = true;
      }
    };

  }
]);
