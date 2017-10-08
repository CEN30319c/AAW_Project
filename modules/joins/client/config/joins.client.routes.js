(function () {
  'use strict';

  angular
    .module('joins')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('joins', {
        // abstract: false,
        url: '/joins',
        controller: 'JoinsController',
        templateUrl: 'modules/joins/client/views/view-join.client.view.html'
      });
  //     .state('joins.list', {
  //       url: '',
  //       templateUrl: 'modules/joins/client/views/list-joins.client.view.html',
  //       controller: 'JoinsListController',
  //       controllerAs: 'vm',
  //       data: {
  //         pageTitle: 'Joins List'
  //       }
  //     })
  //     .state('joins.create', {
  //       url: '/create',
  //       templateUrl: 'modules/joins/client/views/form-join.client.view.html',
  //       controller: 'JoinsController',
  //       controllerAs: 'vm',
  //       resolve: {
  //         joinResolve: newJoin
  //       },
  //       data: {
  //         roles: ['user', 'admin'],
  //         pageTitle: 'Joins Create'
  //       }
  //     })
  //     .state('joins.edit', {
  //       url: '/:joinId/edit',
  //       templateUrl: 'modules/joins/client/views/form-join.client.view.html',
  //       controller: 'JoinsController',
  //       controllerAs: 'vm',
  //       resolve: {
  //         joinResolve: getJoin
  //       },
  //       data: {
  //         roles: ['user', 'admin'],
  //         pageTitle: 'Edit Join {{ joinResolve.name }}'
  //       }
  //     })
  //     .state('joins.view', {
  //       url: '/:joinId',
  //       templateUrl: 'modules/joins/client/views/view-join.client.view.html',
  //       controller: 'JoinsController',
  //       controllerAs: 'vm',
  //       resolve: {
  //         joinResolve: getJoin
  //       },
  //       data: {
  //         pageTitle: 'Join {{ joinResolve.name }}'
  //       }
  //     });
  // }
  //
  // getJoin.$inject = ['$stateParams', 'JoinsService'];
  //
  // function getJoin($stateParams, JoinsService) {
  //   return JoinsService.get({
  //     joinId: $stateParams.joinId
  //   }).$promise;
  // }
  //
  // newJoin.$inject = ['JoinsService'];
  //
  // function newJoin(JoinsService) {
  //   return new JoinsService();
  }
}());
