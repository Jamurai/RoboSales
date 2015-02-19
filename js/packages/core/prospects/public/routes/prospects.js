'use strict';

//Setting up route
angular.module('mean.prospects').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app

    $stateProvider
      .state('importprospects', {
        url: '/prospects/import',
        templateUrl: 'prospects/views/import.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('listprospects', {
        url: '/prospects',
        templateUrl: 'prospects/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit prospect', {
        url: '/prospects/:prospectId/edit',
        templateUrl: 'prospects/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('prospect by id', {
        url: '/prospects/:prospectId',
        templateUrl: 'prospects/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('runcampaign', {
        url: '/prospects/runcampaign',
        templateUrl: 'prospects/views/campaign.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });


  }
]);
