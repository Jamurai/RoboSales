'use strict';

angular.module('mean.settings').config(['$stateProvider',
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
    }

        $stateProvider.state('createsetting', {
            url: '/settings/create',
            templateUrl: 'settings/views/create.html',
            resolve: {
              loggedin: checkLoggedin
            }

        });

        $stateProvider.state('settings', {
            url: '/settings',
            templateUrl: 'settings/views/index.html',
            resolve: {
              loggedin: checkLoggedin
            }

        });
        $stateProvider.state('listsetting', {
            url: '/settings/list',
            templateUrl: 'settings/views/list.html',
            resolve: {
              loggedin: checkLoggedin
            }

        });

        $stateProvider.state('edit setting', {
          url: '/settings/:settingId/edit',
          templateUrl: 'settings/views/edit.html',
          resolve: {
            loggedin: checkLoggedin
          }
        });

        $stateProvider.state('setting by id', {
          url: '/settings/:settingId',
          templateUrl: 'settings/views/view.html',
          resolve: {
            loggedin: checkLoggedin
          }
        });

    }
]);
