'use strict';

// angular.module('core').controller('HomeController', ['$scope', 'Authentication',
//   function ($scope, Authentication) {
//     // This provides Authentication context.
//     $scope.authentication = Authentication;
//   }
// ]);

angular.module('core').controller('HomeController', ['$scope','$modal', '$log', 'Authentication', 'NewsService', 'CalendarsService',
  function ($scope, $modal, $log, Authentication, NewsService, CalendarsService) {
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    $scope.whoweareText = 'AAW strives to empower UF women for the utmost success in each stage of their careers at the university.';
    $scope.myInterval = 3000;
    $scope.slides = [
      {
        image: 'modules/core/client/img/pictures/slide5.png'
      }
    ];

    $scope.newslist = NewsService.query();
    $scope.calendarlist = CalendarsService.query();
    console.log($scope.calendarlist);

    /*$scope.edit = function(header) {
      console.log(header);
      modalUpdate(0, header);
    };*/

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
