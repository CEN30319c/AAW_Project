(function () {
  'use strict';

  angular
    .module('calendars')
    .controller('CalendarsListController', CalendarsListController);

  CalendarsListController.$inject = ['$scope', 'CalendarsService', 'Authentication'];

  function CalendarsListController($scope, CalendarsService, Authentication) {
    var vm = this;

    $scope.user = Authentication.user;

    var bodyError = [{title: 'ERROR', description: 'ERROR', begin: 'ERROR', end: 'ERROR', location: 'ERROR'}];
    vm.calendars = [];
    do {
    	vm.calendars = CalendarsService.query();
    	// console.log('bodyError: ' + JSON.stringify(bodyError));
    	// console.log('vm.calendars: ' + JSON.stringify(vm.calendars));
    	// console.log(JSON.stringify(bodyError) == JSON.stringify(vm.calendars));
	} while(1 === 0);
  }
}());
