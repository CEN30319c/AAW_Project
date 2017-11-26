(function () {
  'use strict';

  // Newabouts controller
  angular
    .module('newabouts')
    .controller('NewaboutsController', NewaboutsController);

  NewaboutsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$log', '$modal','newaboutResolve'];

  function NewaboutsController ($scope, $state, $window, Authentication, $log, $modal, newabout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.newabout = newabout;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.newabout.text = [];
    vm.newabout.titles = ['MISSION', 'LEADERSHIP', 'AWARDS', 'Woman of Distinction Award', 'HISTORY'];
    $scope.p1 = '';
    $scope.p2 = '';
    $scope.p3 = '';
    //$scope.aboutsData = NewaboutsService.query();
    //$scope.user = Authentication.user;

    $scope.show = false;
    $scope.showMission = false;
    $scope.showAwards = false;
    $scope.showWOD_Awards = false;
    $scope.showLeadership = false;
    $scope.showHistory = false;

    // $scope.titles = ['MISSION', 'LEADERSHIP', 'AWARDS', 'Woman of Distinction Award', 'HISTORY'];
    $scope.hello = "Hello World";
    // Remove existing Newabout

    $scope.edit = function() {
      //modalUpdate(0);
      $scope.show = true;
      $scope.p1 = '';
      $scope.p2 = '';
      $scope.p3 = '';

    };


    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.newabout.$remove($state.go('newabouts.list'));
      }
    }


    // Save Newabout
    function save(isValid) {
      console.log('IN SAVE');
      console.log(vm.newabout);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newaboutForm');
        return false;
      }
      if($scope.p1 !== '') {
        vm.newabout.text.push($scope.p1);
      }
      if($scope.p2 !== '') {
        vm.newabout.text.push($scope.p2);
      }
      if($scope.p3 !== '') {
        vm.newabout.text.push($scope.p3);
      }
      // TODO: move create/update logic to service
      if (vm.newabout._id) {
        vm.newabout.$update(successCallback, errorCallback);
      } else {
        vm.newabout.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('newabouts.list', {
          newaboutId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

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
