(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pendingrequets', {
        //abstract: true,
        url: '/pendingrequets',
        template: '<ui-view/>'
      })
      .state('pendingrequets.list', {
        url: '/list',
        templateUrl: 'modules/pendingrequets/client/views/list-pendingrequets.client.view.html',
        controller: 'PendingrequetsListController',
        controllerAs: 'vm',
        resolve: {
          pendingrequetResolve: getPendingrequets
        },
        data: {
          pageTitle: 'Pendingrequets List',
          roles: ['admin']
        }
      })
      .state('pendingrequets.create', {
        url: '/create',
        templateUrl: 'modules/pendingrequets/client/views/form-pendingrequet.client.view.html',
        controller: 'PendingrequetsController',
        controllerAs: 'vm',
        resolve: {
          pendingrequetResolve: newPendingrequet
        },
        data: {
          // roles: [''],
          pageTitle: 'Pendingrequets Create'
        }
      })
      // .state('pendingrequets.edit', {
      //   url: '/:pendingrequetId/edit',
      //   templateUrl: 'modules/pendingrequets/client/views/form-pendingrequet.client.view.html',
      //   controller: 'PendingrequetsController',
      //   controllerAs: 'vm',
      //   resolve: {
      //     pendingrequetResolve: getPendingrequet
      //   },
      //   data: {
      //     roles: ['user', 'admin'],
      //     pageTitle: 'Edit Pendingrequet {{ pendingrequetResolve.name }}'
      //   }
      // })
      .state('pendingrequets.view', {
        url: '/:pendingrequetId',
        templateUrl: 'modules/pendingrequets/client/views/view-pendingrequet.client.view.html',
        controller: 'PendingrequetsController',
        controllerAs: 'vm',
        resolve: {
          pendingrequetResolve: getPendingrequet
        },
        data: {
          pageTitle: 'Pendingrequet {{ pendingrequetResolve.name }}'
        }
      });
  }

  getPendingrequet.$inject = ['$stateParams', 'PendingrequetsService'];

  function getPendingrequet($stateParams, PendingrequetsService) {
    return PendingrequetsService.get({
      pendingrequetId: $stateParams.pendingrequetId
    }).$promise;
  }

    getPendingrequets.$inject = ['PendingrequetsService'];

  function getPendingrequets(PendingrequetsService) {
    return PendingrequetsService.query().$promise;
  }

  newPendingrequet.$inject = ['PendingrequetsService'];

  function newPendingrequet(PendingrequetsService) {
    return new PendingrequetsService();
  }
}());
