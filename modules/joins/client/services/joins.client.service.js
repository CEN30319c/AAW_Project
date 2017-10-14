// Joins service used to communicate Joins REST endpoints
(function () {
  'use strict';

  angular
    .module('joins')
    .factory('JoinsService', JoinsService);

  JoinsService.$inject = ['$resource'];

  function JoinsService($resource) {
    return $resource('api/joins/:joinId', {
      joinId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
