(function () {
  'use strict';

  angular
    .module('calendars')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Calendar',
      state: 'calendars.list',
      // type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'calendars', {
      title: 'List Calendars',
      state: 'calendars.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'calendars', {
      title: 'Create Calendar',
      state: 'calendars.create',
      roles: ['user']
    });
  }
}());
