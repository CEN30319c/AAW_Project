// Miscs service used to communicate Miscs REST endpoints
(function () {
  'use strict';

  angular
    .module('miscs')
    .factory('MiscsService', MiscsService);

  MiscsService.$inject = ['$resource'];

  function MiscsService($resource) {
    return $resource('api/miscs/:miscId', {
      miscId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
