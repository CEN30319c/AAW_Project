(function () {
  'use strict';

  // Pendingrequets controller
  angular
    .module('pendingrequets')
    .controller('PendingrequetsController', PendingrequetsController);

  PendingrequetsController.$inject = ['$scope', '$state', '$window', '$modal', 'Authentication', 'pendingrequetResolve'];

  function PendingrequetsController ($scope, $state, $window, $modal, Authentication, pendingrequet) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pendingrequet = pendingrequet;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    $scope.goToPay = function () {
      $modal.open ({
        templateUrl: 'modules/joins/client/views/modal-join.client.view.html',
        controller:'JoinsController'

      }).result.then(function () {
            //Redirecting to client's current payment page
        var url = 'https://squareup.com/store/UFLAAW';
        $window.open(url);
    });


    };


    $scope.cancelForm = function () {
        $state.go('joins');
    };


    // Remove existing Pendingrequet
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pendingrequet.$remove($state.go('pendingrequets.list'));
      }
    }

    // Save Pendingrequet
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pendingrequetForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.pendingrequet._id) {
        vm.pendingrequet.$update(successCallback, errorCallback);
      } else {
        vm.pendingrequet.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pendingrequets.view', {
          pendingrequetId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
