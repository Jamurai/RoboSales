'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.prospects').factory('Filters', ['$resource',
  function($resource) {
    return $resource('prospects/filters/:filterId', {
      filterId: '@_id'

    }, {
      update: {
        method: 'PUT'
      }

    });
  }
]);
