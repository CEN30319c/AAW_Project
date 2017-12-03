(function () {
  'use strict';

  // Meetingminutes controller
  angular
    .module('meetingminutes')
    .controller('MeetingminutesController', MeetingminutesController);

  MeetingminutesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'meetingminuteResolve'];

  function MeetingminutesController ($scope, $state, $window, Authentication, meetingminute) {
    var vm = this;

    vm.authentication = Authentication;
    vm.meetingminute = meetingminute;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Meetingminute
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.meetingminute.$remove($state.go('meetingminutes.list'));
      }
    }

    // Save Meetingminute
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.meetingminuteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.meetingminute._id) {
        vm.meetingminute.$update(successCallback, errorCallback);
      } else {
        vm.meetingminute.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('meetingminutes.view', {
          meetingminuteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
