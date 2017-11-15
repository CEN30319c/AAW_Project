(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items

    Menus.addMenuItem('topbar', {
      title: 'List New Members',
      state: 'pendingrequets.list',
      // type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'pendingrequets', {
      title: 'Join Now',
      state: 'pendingrequets.create',
      // roles: ['*']
    });
  }
}());
