(function () {
  'use strict';

  angular
    .module('tests')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Tests',
      state: 'tests',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'tests', {
      title: 'List Tests',
      state: 'tests.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'tests', {
      title: 'Create Test',
      state: 'tests.create',
      roles: ['user']
    });
  }
}());
