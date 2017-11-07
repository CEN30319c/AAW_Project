(function () {
  'use strict';

  angular
    .module('calendars')
    .controller('CalendarsListController', CalendarsListController);

  CalendarsListController.$inject = ['CalendarsService'];

  function CalendarsListController(CalendarsService) {
    var vm = this;

    vm.calendars = [{summary: 'event1', begin: '10/31/2017, 3:00 PM', end: '10/31/2017, 4:00 PM'}, {summary: 'event2', begin: '11/1/2017, 1:00 PM', end: '11/1/2017, 2:00 PM'}, {summary: 'event3', begin: '11/27/2017, 12:00 PM', end: '11/27/2017, 2:00 PM'}];
  }
}());
