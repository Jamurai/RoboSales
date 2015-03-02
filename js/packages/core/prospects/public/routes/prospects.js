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
      .state('import', {
        url: '/contacts/import',
        templateUrl: 'prospects/views/import.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('contacts', {
        url: '/contacts',
        templateUrl: 'prospects/views/index.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('listcontacts', {
        url: '/contacts',
        templateUrl: 'prospects/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('editcontact', {
        url: '/contacts/:contactId/edit',
        templateUrl: 'prospects/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('contactbyid', {
        url: '/contacts/:contactId',
        templateUrl: 'prospects/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('runcampaign', {
        url: '/contacts/runcampaign',
        templateUrl: 'prospects/views/campaign.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('createfilter', {
        url: '/contacts/filters/create',
        templateUrl: 'prospects/views/createfilters.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });


  }
]);
