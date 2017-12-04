'use strict';

angular.module('core').controller('HomeController', ['$scope','$modal', '$log', 'Authentication', 'NewsService', 'CalendarsService', 'MiscsService',
  function ($scope, $modal, $log, Authentication, NewsService, CalendarsService, MiscsService) {
    var vm = this;
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    $scope.whoweareText = 'AAW strives to empower UF women for the utmost success in each stage of their careers at the university.';
    $scope.myInterval = 3000;
    $scope.title = 'Home Page Edit';
    $scope.slides = [
      {
        image: 'modules/core/client/img/pictures/slide5.png'
      }
    ];
    $scope.miscData = MiscsService.query();
    //console.log($scope.miscData);
    $scope.newslist = NewsService.query();
    $scope.calendarlist = CalendarsService.query();
    //console.log($scope.calendarlist);

    //var list = $scope.miscData;
    for(var data in $scope.miscData) {
      //console.log(data);
    }
    //console.log($scope.miscData['$promise'][0]);
    // $scope.homePage_id = '';
    //
    //
    // for(var data in $scope.miscData) {
    //   // if(data['name'] == 'homePage') {
    //   //   $scope.homePage_id = data['name'];
    //   // }
    //   console.log($scope.miscData[data]['$$state']['value']);
    // }
    //
    // console.log($scope.homePage_id);
    /*$scope.edit = function(header) {
      console.log(header);
      modalUpdate(0, header);
    };*/

    //$scope.misc = '';

    $scope.HomeUpdate = function(updatedMisc) {
      $log.info('updating');

      //var newDescription = document.getElementById("description").value;
      var p1 = document.getElementById("p1").value;
      console.log(p1);
      var p2 = document.getElementById("p2").value;
      var p3 = document.getElementById("p3").value;
      if (p1 === '' && p2 === '' && p3 === '') {
        $log.info('didnt work');
      }
      else {
        $log.info('should be working');
          var misc = updatedMisc;
          //about.text = document.getElementById("description").value;
          misc.data = [];
          if(p1 !== '') {
            misc.data.push(p1);
          }
          if(p2 !== '') {
            misc.data.push(p2);
          }
          if(p3 !== '') {
            misc.data.push(p3);
          }
          // misc.text.push(p2);
          // misc.text.push(p3);
          console.log("In Function");
          misc.$update(function() {

          }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      }
    };

    $scope.modalHomeEdit = function (misc, size) {
      //$scope.misc = misc;
      console.log("IN FUNCTION");
      var modalInstance = $modal.open({
          templateUrl: "modules/miscs/client/views/misc-editHome-modal-client.view.html",
          controller: function ($scope, $modalInstance, award) {
              $scope.misc = award;

              $scope.ok = function() {
                  // var p1 = document.getElementById("p1").value;
                  // var p2 = document.getElementById("p2").value;
                  // var p3 = document.getElementById("p3").value;
                  $modalInstance.dismiss('cancel');

              };
              $scope.cancel = function() {
                  $modalInstance.dismiss('cancel');
              };
          },
          size: size,
           resolve: {
               award: function() {
                   return misc;
               }
           }
      });

      modalInstance.result.then(function(misc) {
        $scope.selected = misc;
      }, function () {
          $log.info("Modal dismissed at: " + new Date());
      });
  };



    $scope.modalUpdate = function(size, texttoedit) {
      var url = 'modules/core/client/views/modal-home.client.view.html';
      var modalInstance = $modal.open({
        templateUrl: url,
        controller: function ($scope, $modalInstance, text) {
          $scope.newtext = text;
          console.log($scope.newtext);
          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          $scope.update = function (newtext) {
            text = newtext;
            $modalInstance.close(text);
          };

        },
        size: size,
        resolve: {
          text: function() {
            return texttoedit;
          }
        }
      });

      modalInstance.result.then(function () {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

  }

]);

angular.module('core').filter('monthName', [function() {
  return function (monthNumber) { //1 = January
    var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December' ];
    return monthNames[monthNumber - 1];
  };
}]);
