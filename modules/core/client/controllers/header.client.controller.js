'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

angular.module('core')
  .directive('ycNavbarAffix', function($window) {

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var orignOffsetTop = element[0].offsetTop;
        scope.condition = function() {
          return $window.pageYOffset > orignOffsetTop;
        };

        angular.element($window).bind('scroll', function() {
          scope.$apply(function() {
            if (scope.condition()) {
              angular.element(element).addClass('navbar-affix');
            } else {
              angular.element(element).removeClass('navbar-affix');
            }
          });
        });
      }
    };
  });

  angular.module('core')
    .directive('ycNavbarBrandAffix', function($window) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var orignOffsetTop = element[0].offsetTop;
          scope.condition = function() {
            return $window.pageYOffset > orignOffsetTop;
          };

          angular.element($window).bind('scroll', function() {
            scope.$apply(function() {

              scope.showSmallLogo = true;


            });
          });
        }
      };
    });
