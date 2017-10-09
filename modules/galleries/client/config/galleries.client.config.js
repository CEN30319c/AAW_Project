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

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'galleries', {
      title: 'List Galleries',
      state: 'galleries.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'galleries', {
      title: 'Create Gallery',
      state: 'galleries.create',
      roles: ['admin']
    });
  }
}());
