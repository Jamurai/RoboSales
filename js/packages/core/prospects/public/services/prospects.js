'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.prospects').factory('Prospects', ['$resource',
  function($resource) {
    return $resource('prospects/:prospectId', {
      prospectId: '@_id'

    }, {
      update: {
        method: 'PUT'
      }

    });
  }
]);


angular.module('mean.prospects').factory('Campaign', ['$resource',
  function($resource) {
    return $resource('prospects/runcampaign', {

    }, {

      runCampaign: {
        method: 'POST'
      }

    });
  }
]);