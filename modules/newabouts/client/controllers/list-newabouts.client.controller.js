(function () {
  'use strict';

  angular
    .module('newabouts')
    .controller('NewaboutsListController', NewaboutsListController);

  NewaboutsListController.$inject = ['$scope', '$state', 'NewaboutsService', 'Authentication', '$modal', '$log'];

  function NewaboutsListController($scope, $state, NewaboutsService, Authentication, $modal, $log) {
    var vm = this;
    
    $scope.user = Authentication.user;
    $scope.ids = ['mission', 'people', 'awards', 'history'];
    $scope.awardsection = 'why';

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
          award.text = document.getElementById("description").value;

          award.$update(function() {

          }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      }
    };

    $scope.AwardTableUpdate = function(updatedAward) {
        $log.info('updating');
        var newYear = document.getElementById("year").value;
        var newName = document.getElementById("name").value;
        var newDepartment = document.getElementById("department").value;
        if (newYear === '' || newName === '' || newDepartment === '') {
          $log.info('didnt work');
        }
        else {
          $log.info('should be working');
            var award = updatedAward;
            award.year = document.getElementById("year").value;
            award.name = document.getElementById("name").value;
            award.department = document.getElementById("department").value;
  
            award.$update(function() {
  
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
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

  vm.modalTableEdit = function (selectedAward, size) {
    var modalInstance = $modal.open({
        templateUrl: "modules/newabouts/client/views/newabouts-edit-table-modal.client.view.html",
        controller: function ($scope, $modalInstance, award) {
            $scope.award = award;

            $scope.ok = function() {
                var newYear = document.getElementById("year").value;
                var newName = document.getElementById("name").value;
                var newDepartment = document.getElementById("department").value;
                if (newYear === '' || newName === '' || newDepartment === '') {

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

  vm.modalAdd = function (section, size) {
        var modalInstance = $modal.open({
            templateUrl: "modules/newabouts/client/views/newabouts-add-modal.client.view.html",
            controller: function ($scope, $modalInstance) {
                $scope.ok = function() {
                    var newText = document.getElementById("description").value;
                    if (newText === '') {
                    }
                    else {
                        $scope.awardsection = section;
                        $log.info($scope.awardsection);

                        $log.info($scope.awardsection);
                        var thissection = 'madelyn' + $scope.awardsection;
                        $log.info(thissection);
                        var award = new NewaboutsService({
                            text: newText,
                            award: thissection,
                            });
            
                        award.$save(function() {
                            
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
            
                            
                        $modalInstance.close($scope.award);

                        $scope.awardsection = null;
                        $state.reload();      //reloads the page
                    }
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: size,
            resolve: {
                award: function() {
                    
                }
            }
    });

    modalInstance.result.then(function(selectedAward) {
      $scope.selected = selectedAward;
    }, function () {
        $log.info("Modal dismissed at: " + new Date());
    });
  };

  }
}());
