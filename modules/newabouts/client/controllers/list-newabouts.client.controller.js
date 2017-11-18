(function () {
  'use strict';

  angular
    .module('newabouts')
    .controller('NewaboutsListController', NewaboutsListController);

  NewaboutsListController.$inject = ['$scope', 'NewaboutsService', 'Authentication'];

  function NewaboutsListController($scope, NewaboutsService, Authentication) {
    var vm = this;
    $scope.user = Authentication.user;
    $scope.aboutsData = NewaboutsService.query();
    $scope.ids = ['mission', 'people', 'awards', 'history'];

    vm.newabouts = NewaboutsService.query();
  }
}());
