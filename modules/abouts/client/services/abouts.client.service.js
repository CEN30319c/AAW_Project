// Abouts service used to communicate Abouts REST endpoints
(function () {
  'use strict';

  angular
    .module('abouts')
    .factory('AboutsService', AboutsService);

  AboutsService.$inject = ['$resource'];

  function AboutsService($resource) {
    return $resource('api/abouts/:aboutId', {
      aboutId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
