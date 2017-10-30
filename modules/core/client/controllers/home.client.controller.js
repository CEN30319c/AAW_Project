'use strict';

// angular.module('core').controller('HomeController', ['$scope', 'Authentication',
//   function ($scope, Authentication) {
//     // This provides Authentication context.
//     $scope.authentication = Authentication;
//   }
// ]);

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'NewsService',
  function ($scope, Authentication, NewsService) {
    $scope.authentication = Authentication;
    $scope.myInterval = 3000;
    $scope.slides = [
      {
        image: 'modules/core/client/img/pictures/slide 5.png'
      }
    ];

    $scope.newslist = NewsService.query();
  }
]);
