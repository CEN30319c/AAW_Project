(function () {
  'use strict';

  // Pendingrequets controller
  angular
    .module('pendingrequets')
    .controller('PendingrequetsController', PendingrequetsController);

  PendingrequetsController.$inject = ['$scope', '$state', '$window', '$modal', '$timeout', '$location', 'Authentication', 'FileUploader', 'pendingrequetResolve'];

  function PendingrequetsController ($scope, $state, $window, $modal, $timeout, $location, Authentication, FileUploader, pendingrequet) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pendingrequet = pendingrequet;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

  $scope.clicked = function () {
      if(vm.pendingrequet.selection4) {
          $scope.showForm = true;
      } else {
          $scope.showForm = false;
          vm.pendingrequet.interest = '';
          vm.pendingrequet.motivation = '';
      }
  };

    //this function open a modal that allows user to create an account and go to pay
    $scope.goToPay = function () {

      $modal.open ({
        templateUrl: 'modules/joins/client/views/modal-join.client.view.html',
        controller:'JoinsController'

      }).result.then(function () {
            //Redirecting to client's current payment page
        // var url = 'https://squareup.com/store/UFLAAW';
        //$window.open(url);
        $window.location.href = 'https://squareup.com/store/UFLAAW';

    });


    };


    $scope.cancelForm = function () {
      $state.go('joins');
    };


  /*
  * Upload images.
  */
  $scope.fillFields = function () {
      if (vm.pendingrequet.imageURL && vm.pendingrequet.imageURL !== './modules/pendingrequets/client/img/memberImages/uploads/') {
        $scope.imageURL = vm.pendingrequet.imageURL;
      }
      else {
        $scope.imageURL = './modules/pendingrequets/client/img/memberImages/default.png';
        console.log($scope.imageURL);
      }
  };
  // Create file uploader instance
  $scope.uploader = new FileUploader({
      url: '/api/pendingrequets/picture',
      alias: 'newMemberPicture'
  });

  // Set file uploader image filter
  $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
  });
  // Function called after the user selected a new picture file
  $scope.uploader.onAfterAddingFile = function (fileItem) {
      console.log("onAfterAddingFile");
      if ($window.FileReader) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(fileItem._file);
          fileReader.onload = function (fileReaderEvent) {
              $timeout(function () {
                  $scope.imageURL = fileReaderEvent.target.result;

                  // Upload the new selected picture.
                  $scope.uploadPicture();
              }, 0);
          };
      }
  };

  // Called after the user has successfully uploaded a new picture
  $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      console.log("onSuccessItem");

      // Show success message
      $scope.success = true;

      // Populate user object
      vm.pendingrequet.filename = response.file.filename;
      vm.pendingrequet.imageURL = response.file.filename;

      console.log("filename: " + vm.pendingrequet.filename);
  };

  // Called after the user has failed to uploaded a new picture
  $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
  };


  // Change upcoming member picture
  $scope.uploadPicture = function () {
      console.log("upload Picture");

      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
  };

  // Cancel the upload process
  $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      // $scope.imageURL = '';
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
