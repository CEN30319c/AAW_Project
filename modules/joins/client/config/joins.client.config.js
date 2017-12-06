(function () {
  'use strict';

  angular
    .module('joins')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Join Us!',
      state: 'joins',
      roles: ['*'],
      position: 5
    });

    // // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'joins', {
    //   title: 'List Joins',
    //   state: 'joins.list'
    // });
    //
    // // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'joins', {
    //   title: 'Create Join',
    //   state: 'joins.create',
    //   roles: ['user']
    // });
  }
}());
