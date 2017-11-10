(function () {
    'use strict';
  
    // Profiles controller
    angular
      .module('members')
      .controller('ProfilesController', ProfilesController);
  
    ProfilesController.$inject = ['$scope', '$state', '$window', '$modal', '$log', 'ProfilesService'];
  
    function ProfilesController ($scope, $state, $window, $modal, $log, ProfilesService) {
      var vm = this;
      vm.profiles = ProfilesService.query();

      vm.modalUpdate = function (size) {
          var modalInstance = $modal.open({
              templateUrl: "modules/members/client/views/profiles-modal.client.view.html",
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
          }) ;
      };
    }
  }()); 
