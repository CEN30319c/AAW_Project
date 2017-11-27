(function () {
  'use strict';

  angular
    .module('newabouts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('newabouts', {
        abstract: true,
        url: '/about',
        template: '<ui-view/>'
      })
      .state('newabouts.list', {
        url: '',
        templateUrl: 'modules/newabouts/client/views/list-newabouts.client.view.html',
        controller: 'NewaboutsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Newabouts List'
        }
      })
      .state('newabouts.create', {
        url: '/create',
        templateUrl: 'modules/newabouts/client/views/form-newabout.client.view.html',
        controller: 'NewaboutsController',
        controllerAs: 'vm',
        resolve: {
          newaboutResolve: newNewabout
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Newabouts Create'
        }
      })
      .state('newabouts.edit', {
        url: '/:newaboutId/edit',
        templateUrl: 'modules/newabouts/client/views/form-newabout.client.view.html',
        controller: 'NewaboutsController',
        controllerAs: 'vm',
        resolve: {
          newaboutResolve: getNewabout
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Newabout {{ newaboutResolve.name }}'
        }
      })
      .state('newabouts.view', {
        url: '/:newaboutId',
        templateUrl: 'modules/newabouts/client/views/view-newabout.client.view.html',
        controller: 'NewaboutsController',
        controllerAs: 'vm',
        resolve: {
          newaboutResolve: getNewabout
        },
        data: {
          pageTitle: 'Newabout {{ newaboutResolve.name }}'
        }
      })
      .state('newabouts.madelynAward', {
        url: '/madelynAward',
        templateUrl: 'modules/newabouts/client/views/madelynAward-newabouts.client.view.html',
        controller: 'NewaboutsListController',
        controllerAs: 'vm'
      })
      .state('newabouts.distinctionAward', {
        url: '/distinctionAward',
        templateUrl: 'modules/newabouts/client/views/distinctionAward-newabout.client.view.html',
        controller: 'NewaboutsListController',
        controllerAs: 'vm'
      });
  }

  getNewabout.$inject = ['$stateParams', 'NewaboutsService'];

  function getNewabout($stateParams, NewaboutsService) {
    return NewaboutsService.get({
      newaboutId: $stateParams.newaboutId
    }).$promise;
  }

  newNewabout.$inject = ['NewaboutsService'];

  function newNewabout(NewaboutsService) {
    return new NewaboutsService();
  }
}());

angular.module('newabouts')
  .directive('ycSidebarAffix', function($window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var orignOffsetTop = element[0].offsetTop;
        scope.condition = function() {
          return $window.pageYOffset > orignOffsetTop + 125;
        };

        angular.element($window).bind('scroll', function() {
          scope.$apply(function() {
            if (scope.condition()) {
              angular.element(element).addClass('sidebar-affix');
            } else {
              angular.element(element).removeClass('sidebar-affix');
            }
          });
        });
      }
    };
  });
