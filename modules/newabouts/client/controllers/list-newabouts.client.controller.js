(function () {
  'use strict';

  angular
    .module('newabouts')
    .controller('NewaboutsListController', NewaboutsListController);

  NewaboutsListController.$inject = ['$scope', 'NewaboutsService', 'Authentication', '$modal', '$log'];

  function NewaboutsListController($scope, NewaboutsService, Authentication, $modal, $log) {
    var vm = this;
    
    $scope.user = Authentication.user;
    $scope.aboutsData = NewaboutsService.query();
    $scope.ids = ['mission', 'people', 'awards', 'history'];

    vm.newabouts = NewaboutsService.query();

    $scope.AwardUpdate = function(updatedAward) {
      $log.info('updating');
      var newDescription = document.getElementById("description").value;
      if (newDescription === '') {
        $log.info('didnt work');
      }
      else {
        $log.info('should be working');
          var award = updatedAward;
          award.description = document.getElementById("description").value;

          award.$update(function() {

          }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      }
    };

    $scope.AwardTableUpdate = function(updatedAward) {
      var newDescription = document.getElementById("description").value;
      if (newDescription === '') {

      }
      else {
          var award = updatedAward;
          award.description = document.getElementById("description").value;

          award.$update(function() {

          }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      }
    };

    $scope.AwardAdd = function() {
      var newDescription = document.getElementById("description").value;
        if (newDescription === '') {}
        else {
          var award = new NewaboutsService({
              description: newDescription,
              });

              award.$save(function() {
                  
              }, function(errorResponse) {
                  $scope.error = errorResponse.data.message;
              });

              $state.reload();      //reloads the page
      }
    };

    vm.delete = function(selectedAward) {
      var award = selectedAward;

      if (confirm("Are you sure you want to delete this?")) {
          award.$delete(function() {
              
          }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
          });

          $state.reload();      //reloads the page
      }
    };

    vm.modalEdit = function (selectedAward, size) {
      var modalInstance = $modal.open({
          templateUrl: "modules/newabouts/client/views/newabouts-edit-modal.client.view.html",
          controller: function ($scope, $modalInstance, award) {
              $scope.award = award;

              $scope.ok = function() {
                  var newDescription = document.getElementById("description").value;
                  if (newDescription === '') {

                  }
                  else {
                      $modalInstance.close($scope.award);
                  }
              };
              $scope.cancel = function() {
                  $modalInstance.dismiss('cancel');
              };
          },
          size: size,
           resolve: {
               award: function() {
                   return selectedAward;
               }
           }
      });

      modalInstance.result.then(function(selectedAward) {
        $scope.selected = selectedAward;
      }, function () {
          $log.info("Modal dismissed at: " + new Date());
      });
  };

  vm.modalTableEdit = function (selectedProfile, size) {
    var modalInstance = $modal.open({
        templateUrl: "modules/newabouts/client/views/profiles-edit-modal.client.view.html",
        controller: function ($scope, $modalInstance, profile) {
            $scope.profile = profile;

            $scope.ok = function() {
                var newName = document.getElementById("name").value;
                var newDescription = document.getElementById("description").value;
                if (newName === '' || newDescription === '') {

                }
                else {
                    $modalInstance.close($scope.profile);
                }
            };
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');

                $scope.newfilename = null;
                $scope.newimageURL = null;
            };
        },
        size: size,
         resolve: {
             profile: function() {
                 return selectedProfile;
             }
         }
    });

    modalInstance.result.then(function(selectedProfile) {
      $scope.selected = selectedProfile;
    }, function () {
        $log.info("Modal dismissed at: " + new Date());
    });
};

  vm.modalAdd = function (size) {
    var modalInstance = $modal.open({
        templateUrl: "modules/newabouts/client/views/profiles-add-modal.client.view.html",
        controller: function ($scope, $modalInstance) {
            $scope.ok = function() {
                var newName = document.getElementById("name").value;
                var newDescription = document.getElementById("description").value;
                if (newName === '' || newDescription === '') {

                }
                else {
                    $modalInstance.close($scope.profile);
                }
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');

                $scope.newfilename = null;
                $scope.newimageURL = null;
            };
        },
        size: size,
         resolve: {
             profile: function() {
                 
             }
         }
    });

    modalInstance.result.then(function(selectedProfile) {
      $scope.selected = selectedProfile;
    }, function () {
        $log.info("Modal dismissed at: " + new Date());
    });
  };
  }
}());
