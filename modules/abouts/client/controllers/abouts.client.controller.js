(function () {
  'use strict';

  // Abouts controller
  angular
    .module('abouts')
    .controller('AboutsController', AboutsController);

  AboutsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'aboutResolve'];

  function AboutsController ($scope, $state, $window, Authentication, about) {
    var vm = this;

    vm.authentication = Authentication;
    vm.about = about;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing About
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.about.$remove($state.go('abouts.list'));
      }
    }

    // Save About
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.aboutForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.about._id) {
        vm.about.$update(successCallback, errorCallback);
      } else {
        vm.about.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('abouts.view', {
          aboutId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
