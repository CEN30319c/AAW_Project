(function () {
  'use strict';

  // Miscs controller
  angular
    .module('miscs')
    .controller('MiscsController', MiscsController);

  MiscsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'miscResolve'];

  function MiscsController ($scope, $state, $window, Authentication, misc) {
    var vm = this;

    vm.authentication = Authentication;
    vm.misc = misc;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.misc.data = [];
    $scope.p1 = '';
    $scope.p2 = '';
    $scope.p3 = '';
    //var updateContent = [];

    // Remove existing Misc
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.misc.$remove($state.go('miscs.list'));
      }
    }

    // Save Misc
    function save() {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.miscForm');
      //   return false;
      // }

      if($scope.p1 !== '') {
        vm.misc.data.push($scope.p1);
      }
      if($scope.p2 !== '') {
        vm.misc.data.push($scope.p2);
      }
      if($scope.p3 !== '') {
        vm.misc.data.push($scope.p3);
      }

      //vm.misc.data = ['HI', 'BYE'];
      //updateContent = [];
      //vm.misc.name = 'TESTY TEST';

      $scope.p1 = '';
      $scope.p2 = '';
      $scope.p3 = '';

      // TODO: move create/update logic to service
      if (vm.misc._id) {
        vm.misc.$update(successCallback, errorCallback);
      } else {
        vm.misc.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('home', {
          miscId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
