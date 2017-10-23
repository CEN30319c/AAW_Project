(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    // menuService.addMenuItem('topbar', {
    //   title: 'Test',
    //   state: 'pendingrequets',
    //   type: 'dropdown',
    //   roles: ['admin']
    // });

    menuService.addMenuItem('topbar', {
      title: 'Join',
      state: 'pendingrequets',
      type: 'dropdown',
      roles: ['*']
  });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'pendingrequets', {
      title: 'List Pending Requests',
      state: 'pendingrequets.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'pendingrequets', {
      title: 'Join Now',
      state: 'pendingrequets.create'
      // roles: ['*']
    });
  }
}());
