(function () {
  'use strict';

  // Newabouts controller
  angular
    .module('newabouts')
    .controller('NewaboutsController', NewaboutsController);

  NewaboutsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$log', '$modal','newaboutResolve'];

  function NewaboutsController ($scope, $state, $window, Authentication, $log, $modal, newabout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.newabout = newabout;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.newabout.text = [];
    vm.newabout.titles = ['MISSION', 'LEADERSHIP', 'AWARDS', 'Woman of Distinction Award', 'HISTORY'];
    $scope.p1 = '';
    $scope.p2 = '';
    $scope.p3 = '';
    //$scope.user = Authentication.user;

    $scope.show = false;
    $scope.showMission = false;
    $scope.showAwards = false;
    $scope.showWOD_Awards = false;
    $scope.showLeadership = false;
    $scope.showHistory = false;

    // $scope.titles = ['MISSION', 'LEADERSHIP', 'AWARDS', 'Woman of Distinction Award', 'HISTORY'];
    $scope.hello = "Hello World";
    // Remove existing Newabout

    $scope.edit = function() {
      //modalUpdate(0);
      $scope.show = true;
      $scope.p1 = '';
      $scope.p2 = '';
      $scope.p3 = '';

    }


    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.newabout.$remove($state.go('newabouts.list'));
      }
    }


    // Save Newabout
    function save(isValid) {
      console.log("IN SAVE");
      console.log(vm.newabout);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newaboutForm');
        return false;
      }
      if($scope.p1 != '') {
        vm.newabout.text.push($scope.p1);
      }
      if($scope.p2 != '') {
        vm.newabout.text.push($scope.p2);
      }
      if($scope.p3 != '') {
        vm.newabout.text.push($scope.p3);
      }
      // TODO: move create/update logic to service
      if (vm.newabout._id) {
        vm.newabout.$update(successCallback, errorCallback);
      } else {
        vm.newabout.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('newabouts.list', {
          newaboutId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
