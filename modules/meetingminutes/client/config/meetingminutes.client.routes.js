(function () {
  'use strict';

  angular
    .module('meetingminutes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('meetingminutes', {
        abstract: true,
        url: '/meetingminutes',
        template: '<ui-view/>'
      })
      .state('meetingminutes.list', {
        url: '',
        templateUrl: 'modules/meetingminutes/client/views/list-meetingminutes.client.view.html',
        controller: 'MeetingminutesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Meetingminutes List'
        }
      })
      .state('meetingminutes.create', {
        url: '/create',
        templateUrl: 'modules/meetingminutes/client/views/form-meetingminute.client.view.html',
        controller: 'MeetingminutesController',
        controllerAs: 'vm',
        resolve: {
          meetingminuteResolve: newMeetingminute
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Meetingminutes Create'
        }
      })
      .state('meetingminutes.edit', {
        url: '/:meetingminuteId/edit',
        templateUrl: 'modules/meetingminutes/client/views/form-meetingminute.client.view.html',
        controller: 'MeetingminutesController',
        controllerAs: 'vm',
        resolve: {
          meetingminuteResolve: getMeetingminute
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Meetingminute {{ meetingminuteResolve.name }}'
        }
      })
      .state('meetingminutes.view', {
        url: '/:meetingminuteId',
        templateUrl: 'modules/meetingminutes/client/views/view-meetingminute.client.view.html',
        controller: 'MeetingminutesController',
        controllerAs: 'vm',
        resolve: {
          meetingminuteResolve: getMeetingminute
        },
        data: {
          pageTitle: 'Meetingminute {{ meetingminuteResolve.name }}'
        }
      });
  }

  getMeetingminute.$inject = ['$stateParams', 'MeetingminutesService'];

  function getMeetingminute($stateParams, MeetingminutesService) {
    return MeetingminutesService.get({
      meetingminuteId: $stateParams.meetingminuteId
    }).$promise;
  }

  newMeetingminute.$inject = ['MeetingminutesService'];

  function newMeetingminute(MeetingminutesService) {
    return new MeetingminutesService();
  }
}());
