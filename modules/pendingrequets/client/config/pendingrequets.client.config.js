(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items

    menuService.addMenuItem('topbar', {
      title: 'List Pending Requests',
      state: 'pendingrequets.list',
      // type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'pendingrequets', {
    //   title: 'List Pending Requests',
    //   state: 'pendingrequets.list',
    //   roles: ['admin']
    // });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'pendingrequets', {
      title: 'Join Now',
      state: 'pendingrequets.create',
      // roles: ['*']
    });
  }
}());
