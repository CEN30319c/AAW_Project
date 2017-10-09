(function () {
  'use strict';

  // Joins controller
  angular
    .module('joins')
    .controller('JoinsController', JoinsController);

  JoinsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'joinResolve'];

  function JoinsController ($scope, $state, $window, Authentication, join) {
    var vm = this;

    vm.authentication = Authentication;
    vm.join = join;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Join
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.join.$remove($state.go('joins.list'));
      }
    }

    // Save Join
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.joinForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.join._id) {
        vm.join.$update(successCallback, errorCallback);
      } else {
        vm.join.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('joins.view', {
          joinId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
