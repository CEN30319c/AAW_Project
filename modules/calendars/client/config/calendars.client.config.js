(function () {
  'use strict';

  angular
    .module('calendars')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Calendar',
      state: 'calendars.list',
      // type: 'dropdown',
      roles: ['*'],
      position: 1
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'calendars', {
      title: 'List Calendars',
      state: 'calendars.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'calendars', {
      title: 'Create Calendar',
      state: 'calendars.create',
      roles: ['user']
    });
  }
}());
