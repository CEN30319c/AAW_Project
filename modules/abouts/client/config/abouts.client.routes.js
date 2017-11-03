(function () {
  'use strict';

  angular
    .module('abouts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('abouts', {
        // abstract: true,
        url: '/about',
        controller: 'AboutsController',
        templateUrl: 'modules/abouts/client/views/view-about.client.view.html'
      })
      .state('madelynaward', {
        url: '/about/madelynaward',
        controller: 'AboutsController',
        templateUrl: 'modules/abouts/client/views/madelynaward-about.client.view.html',
      })
      .state('distinctionaward', {
        url: '/about/distinctionaward',
        controller: 'AboutsController',
        templateUrl: 'modules/abouts/client/views/distinctionaward-about.client.view.html',
      })
      
      .state('abouts.list', {
        url: '',
        templateUrl: 'modules/abouts/client/views/list-abouts.client.view.html',
        controller: 'AboutsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Abouts List'
        }
      })
      .state('abouts.create', {
        url: '/create',
        templateUrl: 'modules/abouts/client/views/form-about.client.view.html',
        controller: 'AboutsController',
        controllerAs: 'vm',
        resolve: {
          aboutResolve: newAbout
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Abouts Create'
        }
      })
      .state('abouts.edit', {
        url: '/:aboutId/edit',
        templateUrl: 'modules/abouts/client/views/form-about.client.view.html',
        controller: 'AboutsController',
        controllerAs: 'vm',
        resolve: {
          aboutResolve: getAbout
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit About {{ aboutResolve.name }}'
        }
      })
      .state('abouts.view', {
        url: '/:aboutId',
        templateUrl: 'modules/abouts/client/views/view-about.client.view.html',
        controller: 'AboutsController',
        controllerAs: 'vm',
        resolve: {
          aboutResolve: getAbout
        },
        data: {
          pageTitle: 'About {{ aboutResolve.name }}'
        }
      });
  }

  getAbout.$inject = ['$stateParams', 'AboutsService'];
  
  function getAbout($stateParams, AboutsService) {
    return AboutsService.get({
      aboutId: $stateParams.aboutId
    }).$promise;
  }
  
  newAbout.$inject = ['AboutsService'];
  
  function newAbout(AboutsService) {
    return new AboutsService();
  }
}());
