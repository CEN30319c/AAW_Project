(function () {
  'use strict';

  // Joins controller
  angular.module('joins').controller('JoinsController', JoinsController);

  JoinsController.$inject = ['$rootScope', '$scope', '$state', '$window', '$modal', '$location', 'Authentication'];

  function JoinsController ($rootScope, $scope, $state, $window, $modal, Authentication, join) {
    var vm = this;

    vm.authentication = Authentication;
    vm.join = join;
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

    $scope.goToPay = function () {
        //Redirecting to client's current payment page
      var url = 'https://squareup.com/store/UFLAAW';
      $window.open(url);

    };

    $scope.cancelPayment = function () {
        $state.go('joins');
    };

    $scope.openModal = function () {
      $modal.open({
        templateUrl:'modules/joins/client/views/modal-join.client.view.html',
        controller: 'ModalController'

      })
      .result.then(function() {
          // alert('closed');
        console.log('Save and go to payment page');
          //After I saved the info in admin side, I want to redirect to payment html
        $state.go('payment');

          //TODO
          //Submit application button clicked
          //Save inputs and text area info into Admin pending requests!
          //Find a way of how admin can verify payment for a submission


      }, function() {
          // alert('canceled');

      });
    };

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

angular.module('joins').controller('ModalController', ['$scope', function($scope) {

}]);
