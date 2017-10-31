(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .controller('PendingrequetsListController', PendingrequetsListController);

  PendingrequetsListController.$inject = ['PendingrequetsService'];

  function PendingrequetsListController(PendingrequetsService) {
    var vm = this;

    vm.pendingrequets = PendingrequetsService.query();
  }
}());
