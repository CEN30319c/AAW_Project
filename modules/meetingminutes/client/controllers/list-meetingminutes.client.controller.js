(function () {
  'use strict';

  angular
    .module('meetingminutes')
    .controller('MeetingminutesListController', MeetingminutesListController);

  MeetingminutesListController.$inject = ['MeetingminutesService'];

  function MeetingminutesListController(MeetingminutesService) {
    var vm = this;

    vm.meetingminutes = MeetingminutesService.query();
  }
}());
