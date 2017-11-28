(function () {
  'use strict';

  angular
    .module('news')
    .controller('NewsListController', NewsListController);

  NewsListController.$inject = ['$scope', 'NewsService', 'Authentication'];

  function NewsListController($scope, NewsService, Authentication) {
    var vm = this;
    $scope.user = Authentication.user;
    vm.news = NewsService.query();
  }
}());
