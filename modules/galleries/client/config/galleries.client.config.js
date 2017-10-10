(function () {
  'use strict';

  angular
    .module('galleries')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Gallery',
      state: 'galleries',
      // type: 'dropdown',
      roles: ['*']
    });
  }
}());
