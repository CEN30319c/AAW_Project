(function () {
  'use strict';

  angular
    .module('members')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Members',
      state: 'members',
      // type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'members', {
      title: 'List Members',
      state: 'members.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'members', {
      title: 'Create Member',
      state: 'members.create',
      roles: ['user']
    });
  }
}());
