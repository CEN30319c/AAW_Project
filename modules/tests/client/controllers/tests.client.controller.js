(function () {
  'use strict';

  // Tests controller
  angular
    .module('tests')
    .controller('TestsController', TestsController);

  TestsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'testResolve'];

  function TestsController ($scope, $state, $window, Authentication, test) {
    var vm = this;

    vm.authentication = Authentication;
    vm.test = test;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Test
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.test.$remove($state.go('tests.list'));
      }
    }

    // Save Test
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.testForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.test._id) {
        vm.test.$update(successCallback, errorCallback);
      } else {
        vm.test.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('tests.view', {
          testId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
