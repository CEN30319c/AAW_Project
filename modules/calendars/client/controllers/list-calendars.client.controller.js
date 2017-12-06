(function () {
  'use strict';

  angular
    .module('calendars')
    .controller('CalendarsListController', CalendarsListController);

  CalendarsListController.$inject = ['$scope', 'CalendarsService', 'Authentication'];

  function CalendarsListController($scope, CalendarsService, Authentication) {
    var vm = this;

    $scope.user = Authentication.user;

    vm.calendars = CalendarsService.query(); //fills vm.calendars with events
 
  }

}());

angular.module('calendars').filter('monthName', [function() {
  return function (monthNumber) { //1 = January
    var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December' ];
    return monthNames[monthNumber - 1];
  };
}]);
