(function () {
  'use strict';

  angular
    .module('news')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'News',
      state: 'news',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'news', {
      title: 'List News',
      state: 'news.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'news', {
      title: 'Create News',
      state: 'news.create',
      roles: ['user']
    });
  }
}());
