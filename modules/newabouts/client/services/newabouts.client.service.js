// Newabouts service used to communicate Newabouts REST endpoints
(function () {
  'use strict';

  angular
    .module('newabouts')
    .factory('NewaboutsService', NewaboutsService);

  NewaboutsService.$inject = ['$resource'];

  function NewaboutsService($resource) {
    return $resource('api/newabouts/:newaboutId', {
      newaboutId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
