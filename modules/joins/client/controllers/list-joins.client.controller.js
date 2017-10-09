(function () {
  'use strict';

  angular
    .module('joins')
    .controller('JoinsListController', JoinsListController);

  JoinsListController.$inject = ['JoinsService'];

  function JoinsListController(JoinsService) {
    var vm = this;

    vm.joins = JoinsService.query();
  }
}());
