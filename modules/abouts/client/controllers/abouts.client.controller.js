(function () {
  'use strict';

  // Abouts controller
  angular
    .module('abouts')
    .controller('AboutsController', AboutsController);

  AboutsController.$inject = ['$scope', '$state', '$window','$modal', '$log', 'Authentication', 'AboutsService'];



  function AboutsController ($scope, $state, $window, $modal, $log, Authentication, AboutsService, abouts) {
    var vm = this;

    vm.aboutsData = AboutsService.query();
    vm.authentication = Authentication;
    //$scope.currUserStatus = vm.authentication.user.roles[0];
    $scope.user = Authentication.user;
    //$scope.curr = 1;
    vm.about = abouts;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    //$scope.selectedEdit = 'Hi';

     $scope.edit = function(header) {
      console.log(header);

      // switch (header) {
      //   case 'mission':
      //     //$scope.selectedEdit = 'Mission';
      //     break;
      //   case 'awards':
      //     break;
      //
      //   case 'WOD_Award':
      //     break;
      //
      //   case 'history':
      //     break;
      //
      //   default:
      //     break;
      //
      // }

      modalUpdate(0, header);
    }

    function modalUpdate(size, header) {
      var url = ''
      if(header != 'mission') {
        url = "modules/abouts/client/views/modal-abouts-" + header + ".client.view.html"
      }

      else {
        url = "modules/abouts/client/views/modal-abouts.client.view.html";
      }
        var modalInstance = $modal.open({
            templateUrl: url,
            controller: function ($scope, $modalInstance) {
                //$scope.member = member;
            },
            size: size
          //   resolve: {
          //       member: function() {
          //           return selectedMember;
          //       }
          //   }
        });

        modalInstance.result.then(function() {
        }, function () {
            $log.info("Modal dismissed at: " + new Date());
        });
    };

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
