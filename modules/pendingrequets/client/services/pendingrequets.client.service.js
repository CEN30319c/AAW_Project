// Pendingrequets service used to communicate Pendingrequets REST endpoints
(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .factory('PendingrequetsService', PendingrequetsService);

  PendingrequetsService.$inject = ['$resource'];

  function PendingrequetsService($resource) {
    return $resource('api/pendingrequets/:pendingrequetId', {
      pendingrequetId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
