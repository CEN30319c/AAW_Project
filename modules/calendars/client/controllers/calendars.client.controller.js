(function () {
  'use strict';

  // Calendars controller
  angular
    .module('calendars')
    .controller('CalendarsController', CalendarsController);

  CalendarsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'calendarResolve'];

  function CalendarsController ($scope, $state, $window, Authentication, calendar) {
    var vm = this;

    vm.authentication = Authentication;
    vm.calendar = calendar;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Calendar
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.calendar.$remove($state.go('calendars.list'));
      }
    }

    // Save Calendar
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.calendarForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.calendar._id) {
        vm.calendar.$update(successCallback, errorCallback);
      } else {
        vm.calendar.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('calendars.view', {
          calendarId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
