(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items

    Menus.addMenuItem('topbar', {
      title: 'List Pending Requests',
      state: 'pendingrequets.list',
      // type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'pendingrequets', {
    //   title: 'List Pending Requests',
    //   state: 'pendingrequets.list',
    //   roles: ['admin']
    // });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'pendingrequets', {
      title: 'Join Now',
      state: 'pendingrequets.create',
      // roles: ['*']
    });
  }
}());
