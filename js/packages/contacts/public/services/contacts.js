'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.contacts').factory('contacts', ['$resource',
  function($resource) {
    return $resource('contacts', {

    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
