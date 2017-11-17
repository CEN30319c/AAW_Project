(function () {
    'use strict';
  
    // Profiles controller
    angular
      .module('members')
      .controller('ProfilesController', ProfilesController);
  
    ProfilesController.$inject = ['$scope', '$state', '$window', '$modal', '$log', 'MembersService', 'Authentication'];
  
    function ProfilesController ($scope, $state, $window, $modal, $log, MembersService, Authentication, member) {
      var vm = this;
      vm.member = member;
      vm.authentication = Authentication;
      $scope.user = Authentication.user;
      $scope.profiles = MembersService.query();

      $scope.ProfileUpdate = function(updatedProfile) {
        $log.info('help');
        var profile = updatedProfile;

          profile.$update(function() {

          }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
          })
      }

      vm.modalUpdate = function (selectedProfile, size) {
          var modalInstance = $modal.open({
              templateUrl: "modules/members/client/views/profiles-modal.client.view.html",
              controller: function ($scope, $modalInstance, profile) {
                  $scope.profile = profile;

                  $scope.ok = function() {
                      $modalInstance.close($scope.profile);
                  };
                  $scope.cancel = function() {
                      $modalInstance.dismiss('cancel');
                  }
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

      vm.modalEdit = function (selectedProfile, size) {
        var modalInstance = $modal.open({
            templateUrl: "modules/members/client/views/profiles-edit-modal.client.view.html",
            controller: function ($scope, $modalInstance, profile) {
                $scope.profile = profile;

                $scope.ok = function() {
                    $modalInstance.close($scope.profile);
                };
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                }
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
    }
  }());
