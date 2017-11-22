'use strict';

// angular.module('core').controller('HomeController', ['$scope', 'Authentication',
//   function ($scope, Authentication) {
//     // This provides Authentication context.
//     $scope.authentication = Authentication;
//   }
// ]);

// <<<<<<< Updated upstream
angular.module('core').controller('HomeController', ['$scope','$modal', '$log', 'Authentication', 'NewsService', 'CalendarsService', 'MiscsService',
  function ($scope, $modal, $log, Authentication, NewsService, CalendarsService, MiscsService) {
// =======
// angular.module('core').controller('HomeController', ['$scope','$modal', '$log', 'Authentication', 'NewsService', 'MiscsService',
//   function ($scope, $modal, $log, Authentication, NewsService, MiscsService) {
// >>>>>>> Stashed changes
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    $scope.whoweareText = 'AAW strives to empower UF women for the utmost success in each stage of their careers at the university.';
    $scope.myInterval = 3000;
    $scope.slides = [
      {
        image: 'modules/core/client/img/pictures/slide5.png'
      }
    ];
    $scope.miscData = MiscsService.query();
    console.log($scope.miscData);
    $scope.newslist = NewsService.query();
    $scope.calendarlist = CalendarsService.query();
    console.log($scope.calendarlist);

    //var list = $scope.miscData;
    for(var data in $scope.miscData) {
      console.log(data);
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
