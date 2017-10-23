// Tests service used to communicate Tests REST endpoints
(function () {
  'use strict';

  angular
    .module('tests')
    .factory('TestsService', TestsService);

  TestsService.$inject = ['$resource'];

  function TestsService($resource) {
    return $resource('api/tests/:testId', {
      testId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
