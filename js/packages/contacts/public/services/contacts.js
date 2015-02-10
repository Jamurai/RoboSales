'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.contacts').factory('Contacts', ['$resource',
  function($resource) {
    return $resource('contacts/:contactId', {
      articleId: '@_id'

    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
