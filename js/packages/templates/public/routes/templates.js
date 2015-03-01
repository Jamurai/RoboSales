'use strict';

angular.module('mean.templates').config(['$stateProvider',
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

        $stateProvider.state('createtemplate', {
            url: '/templates/create',
            templateUrl: 'templates/views/create.html',
            resolve: {
              loggedin: checkLoggedin
            }

        });

        $stateProvider.state('templates', {
            url: '/templates',
            templateUrl: 'templates/views/index.html',
            resolve: {
              loggedin: checkLoggedin
            }

        });
        $stateProvider.state('listtemplate', {
            url: '/templates/list',
            templateUrl: 'templates/views/list.html',
            resolve: {
              loggedin: checkLoggedin
            }

        });

        $stateProvider.state('edit template', {
          url: '/templates/:templateId/edit',
          templateUrl: 'templates/views/edit.html',
          resolve: {
            loggedin: checkLoggedin
          }
        });

        $stateProvider.state('template by id', {
          url: '/templates/:templateId',
          templateUrl: 'templates/views/view.html',
          resolve: {
            loggedin: checkLoggedin
          }
        });

    }
]);
