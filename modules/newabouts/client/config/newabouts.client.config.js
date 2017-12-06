(function () {
  'use strict';

  angular
    .module('newabouts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'About',
      state: 'newabouts.list',
      //type: 'dropdown',
      roles: ['*'],
      position: 0
    });

    // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'newabouts', {
    //   title: 'List Newabouts',
    //   state: 'newabouts.list'
    // });

    // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'newabouts', {
    //   title: 'Create Newabout',
    //   state: 'newabouts.create'
    //   //roles: ['user']
    // });
  }
}());
