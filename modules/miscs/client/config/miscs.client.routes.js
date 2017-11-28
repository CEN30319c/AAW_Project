(function () {
  'use strict';

  angular
    .module('miscs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('miscs', {
        abstract: true,
        url: '/miscs',
        template: '<ui-view/>'
      })
      .state('miscs.list', {
        url: '',
        templateUrl: 'modules/miscs/client/views/list-miscs.client.view.html',
        controller: 'MiscsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Miscs List'
        }
      })
      .state('miscs.create', {
        url: '/create',
        templateUrl: 'modules/miscs/client/views/form-misc.client.view.html',
        controller: 'MiscsController',
        controllerAs: 'vm',
        resolve: {
          miscResolve: newMisc
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Miscs Create'
        }
      })
      .state('miscs.edit', {
        url: '/:miscId/edit',
        templateUrl: 'modules/miscs/client/views/form-misc.client.view.html',
        controller: 'MiscsController',
        controllerAs: 'vm',
        resolve: {
          miscResolve: getMisc
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Misc {{ miscResolve.name }}'
        }
      })
      .state('miscs.view', {
        url: '/:miscId',
        templateUrl: 'modules/miscs/client/views/view-misc.client.view.html',
        controller: 'MiscsController',
        controllerAs: 'vm',
        resolve: {
          miscResolve: getMisc
        },
        data: {
          pageTitle: 'Misc {{ miscResolve.name }}'
        }
      });
  }

  getMisc.$inject = ['$stateParams', 'MiscsService'];

  function getMisc($stateParams, MiscsService) {
    return MiscsService.get({
      miscId: $stateParams.miscId
    }).$promise;
  }

  newMisc.$inject = ['MiscsService'];

  function newMisc(MiscsService) {
    return new MiscsService();
  }
}());
