'use strict';

angular.module('mean.prospects').controller('FiltersController', ['$scope','$stateParams', '$location', 'Global','Filters',
  function($scope,$stateParams, $location,Global,Filters) {
    $scope.global = Global;

    $scope.status = '';
    $scope.fields = ['1','2','3'];

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
      if (isValid) {
        var filter = new Filters({
          name: this.name,
          filterset: this.filterset

        });
        filter.$save(function(response) {
          $location.path('contacts/filters/create');
        });

        this.name = '';
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
          $location.path('contacts/filters/create');
        });
      } else {
        $scope.filter.$remove(function(response) {
          $location.path('contacts/filters/create');
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
          $location.path('contacts/filters/create');
        });
      } else {
        $scope.submitted = true;
      }
    };

  }
]);
