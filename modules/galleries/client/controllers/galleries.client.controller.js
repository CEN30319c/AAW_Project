(function () {
  'use strict';

  // Galleries controller
  angular
    .module('galleries')
    .controller('GalleriesController', GalleriesController);

  GalleriesController.$inject = ['$scope', '$state', '$window', 'Authentication'];

  function GalleriesController ($scope, $state, $window, Authentication, gallery) {
    var vm = this;

    vm.authentication = Authentication;
    vm.gallery = gallery;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Gallery
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.gallery.$remove($state.go('galleries.list'));
      }
    }

    // Save Gallery
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.galleryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.gallery._id) {
        vm.gallery.$update(successCallback, errorCallback);
      } else {
        vm.gallery.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('galleries.view', {
          galleryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    ///////////////

    $scope.albumName = 'Album Name';


  }
}());
