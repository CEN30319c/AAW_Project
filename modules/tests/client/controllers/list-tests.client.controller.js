(function () {
  'use strict';

  angular
    .module('tests')
    .controller('TestsListController', TestsListController);

  TestsListController.$inject = ['TestsService'];

  function TestsListController(TestsService) {
    var vm = this;

    vm.tests = TestsService.query();
  }
}());
