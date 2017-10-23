(function () {
  'use strict';

  angular
    .module('tests')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tests', {
        abstract: true,
        url: '/tests',
        template: '<ui-view/>'
      })
      .state('tests.list', {
        url: '',
        templateUrl: 'modules/tests/client/views/list-tests.client.view.html',
        controller: 'TestsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tests List'
        }
      })
      .state('tests.create', {
        url: '/create',
        templateUrl: 'modules/tests/client/views/form-test.client.view.html',
        controller: 'TestsController',
        controllerAs: 'vm',
        resolve: {
          testResolve: newTest
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Tests Create'
        }
      })
      .state('tests.edit', {
        url: '/:testId/edit',
        templateUrl: 'modules/tests/client/views/form-test.client.view.html',
        controller: 'TestsController',
        controllerAs: 'vm',
        resolve: {
          testResolve: getTest
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Test {{ testResolve.name }}'
        }
      })
      .state('tests.view', {
        url: '/:testId',
        templateUrl: 'modules/tests/client/views/view-test.client.view.html',
        controller: 'TestsController',
        controllerAs: 'vm',
        resolve: {
          testResolve: getTest
        },
        data: {
          pageTitle: 'Test {{ testResolve.name }}'
        }
      });
  }

  getTest.$inject = ['$stateParams', 'TestsService'];

  function getTest($stateParams, TestsService) {
    return TestsService.get({
      testId: $stateParams.testId
    }).$promise;
  }

  newTest.$inject = ['TestsService'];

  function newTest(TestsService) {
    return new TestsService();
  }
}());
