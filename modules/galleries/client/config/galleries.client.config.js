(function () {
  'use strict';

  angular
    .module('galleries')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Gallery',
      state: 'galleries',
      // type: 'dropdown',
      roles: ['*'],
      position: 4
    });
  }
}());
