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


    //$scope variables prototypes
    $scope.myInterval = 3000;
    $scope.slides = [
        {
            image: 'modules/core/client/img/pictures/1.jpg',
            text: 'Recognition and Talent'
        },
        {
            image: 'modules/core/client/img/pictures/2.jpg',
            text: 'Hard Work'
        },
        {
            image: 'modules/core/client/img/pictures/3.jpg',
            text: 'Having Fun'
        },
        {
            image: 'modules/core/client/img/pictures/4.jpg',
            text: 'Panels and Discussion'
        }
    ];

  // $scope.showModal = function () {
  //   $scope.showme=false;
  //   var modalTest = $modal.open({
  //       template: '<div>{{vm.form.pendingrequetForm}}</div>'
  //
  //
  //
  //   });
  //
  // };


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
