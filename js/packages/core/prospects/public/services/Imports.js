'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.prospects').factory('ImportHistory', ['$resource',
  function($resource) {
    return $resource('prospects/history/:historyId', {
      historyId: '@_id'

    }, {
      update: {
        method: 'PUT'
      }

    });
  }
]);