(function () {
  'use strict';

  angular
    .module('miscs')
    .controller('MiscsListController', MiscsListController);

  MiscsListController.$inject = ['MiscsService'];

  function MiscsListController(MiscsService) {
    var vm = this;

    vm.miscs = MiscsService.query();
  }
}());
