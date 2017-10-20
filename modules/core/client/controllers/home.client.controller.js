'use strict';

// angular.module('core').controller('HomeController', ['$scope', 'Authentication',
//   function ($scope, Authentication) {
//     // This provides Authentication context.
//     $scope.authentication = Authentication;
//   }
// ]);

angular.module('core').controller('HomeController', ['$scope',
  function ($scope) {
    $scope.myInterval = 3000;
    $scope.slides = [
      {
        image: 'modules/core/client/img/pictures/1.jpg'
      },
      {
        image: 'modules/core/client/img/pictures/2.jpg'
      },
      {
        image: 'modules/core/client/img/pictures/3.jpg'
      },
      {
        image: 'modules/core/client/img/pictures/4.jpg'
      }
    ];
  }
]);
