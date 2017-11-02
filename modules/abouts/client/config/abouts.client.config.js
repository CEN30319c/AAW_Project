(function () {
  'use strict';

  angular
    .module('abouts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'About',
      state: 'abouts',
      // type: 'dropdown',
      roles: ['*']
    });

    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'abouts', {
    //   title: 'List Abouts',
    //   state: 'abouts.list'
    // });
    //
    // // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'abouts', {
    //   title: 'Create About',
    //   state: 'abouts.create',
    //   roles: ['admin']
    // });
  }
}());
