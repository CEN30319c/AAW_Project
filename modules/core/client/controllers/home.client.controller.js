'use strict';

// angular.module('core').controller('HomeController', ['$scope', 'Authentication',
//   function ($scope, Authentication) {
//     // This provides Authentication context.
//     $scope.authentication = Authentication;
//   }
// ]);

angular.module('core').controller('HomeController', ['$scope','$modal', '$log', 'Authentication', 'NewsService',
  function ($scope, $modal, $log, Authentication, NewsService) {
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

    $scope.edit = function(header) {
      console.log(header);
      modalUpdate(0, header);
    };

    function modalUpdate(size, header) {
      var url = 'modules/core/client/views/modal-home.client.view.html';
      var modalInstance = $modal.open({
        templateUrl: url,
        controller: function ($scope, $modalInstance) {

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          $scope.update = function () {

          };

        },
        size: size,
      });

      modalInstance.result.then(function () {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

  }
]);
