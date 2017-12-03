// Meetingminutes service used to communicate Meetingminutes REST endpoints
(function () {
  'use strict';

  angular
    .module('meetingminutes')
    .factory('MeetingminutesService', MeetingminutesService);

  MeetingminutesService.$inject = ['$resource'];

  function MeetingminutesService($resource) {
    return $resource('api/meetingminutes/:meetingminuteId', {
      meetingminuteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
