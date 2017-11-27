(function () {
  'use strict';

  // Abouts controller
  angular
    .module('abouts')
    .controller('AboutsController', AboutsController);

  AboutsController.$inject = ['$scope', '$state', '$window','$modal', '$log', 'Authentication'];



  function AboutsController ($scope, $state, $window, $modal, $log, Authentication, about) {
    var vm = this;

    //$scope.aboutsData = AboutsService.query();
    vm.authentication = Authentication;
    $scope.data = '';
    //$scope.currUserStatus = vm.authentication.user.roles[0];
    $scope.user = Authentication.user;
    //$scope.curr = 1;
    vm.abouts = about;
    //vm.abouts.test = 10;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    // vm.save = save;
    //$scope.selectedEdit = 'Hi';

     $scope.edit = function(header) {
      console.log(header);
      console.log(vm.abouts);

      modalUpdate(0, header);
    };

    function modalUpdate(size, header) {
      var url = '';
      if(header != 'mission') {
        url = "modules/abouts/client/views/modal-abouts-" + header + ".client.view.html";
      }

      else {
        url = "modules/abouts/client/views/modal-abouts.client.view.html";
      }
        var modalInstance = $modal.open({
            templateUrl: url,
            controller: AboutsController,
            size: size
        });

        modalInstance.result.then(function() {
        }, function () {
            $log.info("Modal dismissed at: " + new Date());
        });
    }

    $scope.updateText = function(header) {

    };

    // Remove existing About
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.abouts.$remove($state.go('abouts.list'));
      }
    }

    // Save About
     $scope.save = function(isValid) {
      console.log("In SAVE");
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.aboutForm');
        return false;
      }

      // console.log($scope.data);
      // TODO: move create/update logic to service
       if (vm.about._id) {
         vm.abouts.$update(successCallback, errorCallback);
       }
      else {
      // console.log(vm.abouts);
      // vm.abouts.contentType = header;
        vm.abouts.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        // $state.go('abouts.view', {
        //   aboutId: res._id
        // });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };


  }
}());
