(function () {
  'use strict';

  angular
    .module('galleries')
    .controller('GalleriesListController', GalleriesListController);

  GalleriesListController.$inject = ['GalleriesService'];

  function GalleriesListController(GalleriesService) {
    var vm = this;

    vm.galleries = GalleriesService.query();
  }
}());
