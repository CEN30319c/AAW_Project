(function () {
  'use strict';

  angular
    .module('abouts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'About',
      state: 'abouts',
      // type: 'dropdown',
      roles: ['*']
    });

    // // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'abouts', {
    //   title: 'List Abouts',
    //   state: 'abouts.list'
    // });
    //
    // // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'abouts', {
    //   title: 'Create About',
    //   state: 'abouts.create',
    //   roles: ['admin']
    // });
  }
}());
