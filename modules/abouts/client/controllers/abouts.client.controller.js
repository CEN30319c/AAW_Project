(function () {
  'use strict';

  // Abouts controller
  angular
    .module('abouts')
    .controller('AboutsController', AboutsController);

  AboutsController.$inject = ['$scope', '$state', '$window','$modal', '$log', 'Authentication', 'AboutsService'];



  function AboutsController ($scope, $state, $window, $modal, $log, Authentication, AboutsService, abouts) {
    var vm = this;

    $scope.aboutsData = AboutsService.query();
    vm.authentication = Authentication;
    //$scope.currUserStatus = vm.authentication.user.roles[0];
    $scope.user = Authentication.user;
    //$scope.curr = 1;
    vm.about = abouts;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    //vm.save = save;
    //$scope.selectedEdit = 'Hi';

     $scope.edit = function(header) {
      console.log(header);

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

            },
            size: size
        });

        modalInstance.result.then(function() {
        }, function () {
            $log.info("Modal dismissed at: " + new Date());
        });
    };

    $scope.updateText = function(header) {

    }

    // Remove existing About
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.about.$remove($state.go('abouts.list'));
      }
    }

    // Save About
    $scope.save = function(header) {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.aboutForm');
      //   return false;
      // }
      console.log("In SAVE");
      // TODO: move create/update logic to service
      // if (vm.about._id) {
      //   vm.about.$update(successCallback, errorCallback);
      // }
      //else {
        console.log(vm.about);
        vm.about.contentType = header;
        vm.about.$save(successCallback, errorCallback);
      //}

      function successCallback(res) {
        // $state.go('abouts.view', {
        //   aboutId: res._id
        // });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


  }
}());
