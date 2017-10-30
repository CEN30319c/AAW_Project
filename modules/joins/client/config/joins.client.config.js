(function () {
  'use strict';

  angular
    .module('joins')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Join Us!',
      state: 'joins',
      // type: 'dropdown',
      roles: ['*']
    });
    menuService.addMenuItem('topbar', {
      title: 'List Pending Requests',
      state: 'list',
      roles: ['admin']
    });
    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'joins', {
    //   title: 'List Joins',
    //   state: 'joins.list'
    // });
    //
    // // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'joins', {
    //   title: 'Create Join',
    //   state: 'joins.create',
    //   roles: ['user']
    // });
  }
}());
