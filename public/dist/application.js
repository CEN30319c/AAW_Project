'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

(function (app) {
  'use strict';

  app.registerModule('calendars');
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
  'use strict';

  app.registerModule('galleries');
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('joins');
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('members');
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('miscs');
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('newabouts');
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('news');
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('pendingrequets');
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

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
      roles: ['*']
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

(function () {
  'use strict';

  angular
    .module('calendars')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('calendars', {
        abstract: true,
        url: '/calendars',
        template: '<ui-view/>'
      })
      .state('calendars.list', {
        url: '',
        templateUrl: 'modules/calendars/client/views/list-calendars.client.view.html',
        controller: 'CalendarsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Calendars List'
        }
      })
      .state('calendars.create', {
        url: '/create',
        templateUrl: 'modules/calendars/client/views/form-calendar.client.view.html',
        controller: 'CalendarsController',
        controllerAs: 'vm',
        resolve: {
          calendarResolve: newCalendar
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Calendars Create'
        }
      })
      .state('calendars.edit', {
        url: '/:calendarId/edit',
        templateUrl: 'modules/calendars/client/views/form-calendar.client.view.html',
        controller: 'CalendarsController',
        controllerAs: 'vm',
        resolve: {
          calendarResolve: getCalendar
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Calendar {{ calendarResolve.name }}'
        }
      })
      .state('calendars.view', {
        url: '/:calendarId',
        templateUrl: 'modules/calendars/client/views/view-calendar.client.view.html',
        controller: 'CalendarsController',
        controllerAs: 'vm',
        resolve: {
          calendarResolve: getCalendar
        },
        data: {
          pageTitle: 'Calendar {{ calendarResolve.name }}'
        }
      });
  }

  getCalendar.$inject = ['$stateParams', 'CalendarsService'];

  function getCalendar($stateParams, CalendarsService) {
    return CalendarsService.get({
      calendarId: $stateParams.calendarId
    }).$promise;
  }

  newCalendar.$inject = ['CalendarsService'];

  function newCalendar(CalendarsService) {
    return new CalendarsService();
  }
}());

(function () {
  'use strict';

  // Calendars controller
  angular
    .module('calendars')
    .controller('CalendarsController', CalendarsController);

  CalendarsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'calendarResolve'];

  function CalendarsController ($scope, $state, $window, Authentication, calendar) {
    var vm = this;

    vm.authentication = Authentication;
    vm.calendar = calendar;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Calendar
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.calendar.$remove($state.go('calendars.list'));
      }
    }

    // Save Calendar
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.calendarForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.calendar._id) {
        vm.calendar.$update(successCallback, errorCallback);
      } else {
        vm.calendar.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('calendars.view', {
          calendarId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

(function () {
  'use strict';

  angular
    .module('calendars')
    .controller('CalendarsListController', CalendarsListController);

  CalendarsListController.$inject = ['$scope', 'CalendarsService', 'Authentication'];

  function CalendarsListController($scope, CalendarsService, Authentication) {
    var vm = this;

    $scope.user = Authentication.user;

    var bodyError = [{title: 'ERROR', description: 'ERROR', begin: 'ERROR', end: 'ERROR', location: 'ERROR'}];
    vm.calendars = [];
    do {
    	vm.calendars = CalendarsService.query();
    	// console.log('bodyError: ' + JSON.stringify(bodyError));
    	// console.log('vm.calendars: ' + JSON.stringify(vm.calendars));
    	// console.log(JSON.stringify(bodyError) == JSON.stringify(vm.calendars));
	} while(1 === 0);
  }
}());

// Calendars service used to communicate Calendars REST endpoints
(function () {
  'use strict';

  angular
    .module('calendars')
    .factory('CalendarsService', CalendarsService);

  CalendarsService.$inject = ['$resource'];

  function CalendarsService($resource) {
    return $resource('api/ical', {
      update: {
        method: 'GET'
      }
    });
  }
}());

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('FooterController', ['$scope',
  function ($scope) {

  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

angular.module('core')
  .directive('ycNavbarAffix', ["$window", function($window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var orignOffsetTop = element[0].offsetTop;
        scope.condition = function() {
          return $window.pageYOffset > orignOffsetTop;
        };

        angular.element($window).bind('scroll', function() {
          scope.$apply(function() {
            if (scope.condition()) {
              angular.element(element).addClass('navbar-affix');
            } else {
              angular.element(element).removeClass('navbar-affix');
            }
          });
        });
      }
    };
  }]);

'use strict';

angular.module('core').controller('HomeController', ['$scope','$modal', '$log', 'Authentication', 'NewsService', 'CalendarsService', 'MiscsService',
  function ($scope, $modal, $log, Authentication, NewsService, CalendarsService, MiscsService) {

    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    $scope.whoweareText = 'AAW strives to empower UF women for the utmost success in each stage of their careers at the university.';
    $scope.myInterval = 3000;
    $scope.slides = [
      {
        image: 'modules/core/client/img/pictures/slide5.png'
      }
    ];
    $scope.miscData = MiscsService.query();
    //console.log($scope.miscData);
    $scope.newslist = NewsService.query();
    $scope.calendarlist = CalendarsService.query();
    //console.log($scope.calendarlist);

    //var list = $scope.miscData;
    for(var data in $scope.miscData) {
      console.log(data);
    }
    //console.log($scope.miscData['$promise'][0]);
    // $scope.homePage_id = '';
    //
    //
    // for(var data in $scope.miscData) {
    //   // if(data['name'] == 'homePage') {
    //   //   $scope.homePage_id = data['name'];
    //   // }
    //   console.log($scope.miscData[data]['$$state']['value']);
    // }
    //
    // console.log($scope.homePage_id);
    /*$scope.edit = function(header) {
      console.log(header);
      modalUpdate(0, header);
    };*/

    $scope.modalUpdate = function(size, texttoedit) {
      var url = 'modules/core/client/views/modal-home.client.view.html';
      var modalInstance = $modal.open({
        templateUrl: url,
        controller: ["$scope", "$modalInstance", "text", function ($scope, $modalInstance, text) {
          $scope.newtext = text;
          console.log($scope.newtext);
          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          $scope.update = function (newtext) {
            text = newtext;
            $modalInstance.close(text);
          };

        }],
        size: size,
        resolve: {
          text: function() {
            return texttoedit;
          }
        }
      });

      modalInstance.result.then(function () {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

(function () {
  'use strict';

  angular
    .module('galleries')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Gallery',
      state: 'galleries',
      // type: 'dropdown',
      roles: ['*']
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('galleries')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('galleries', {
        // abstract: true,
        url: '/gallery',
        controller: 'GalleriesController',
        templateUrl: 'modules/galleries/client/views/view-gallery.client.view.html'
      })
     .state('galleries.album', {
       url: '/album',
       controller: 'GalleriesController',
       templateUrl: 'modules/galleries/client/views/album-gallery.client.view.html',
     });
//      .state('galleries.create', {
//        url: '/create',
//        templateUrl: 'modules/galleries/client/views/form-gallery.client.view.html',
//        controller: 'GalleriesController',
//        controllerAs: 'vm',
//        resolve: {
//          galleryResolve: newGallery
//        },
//        data: {
//          roles: ['user', 'admin'],
//          pageTitle: 'Galleries Create'
//        }
//      })
//      .state('galleries.edit', {
//        url: '/:galleryId/edit',
//        templateUrl: 'modules/galleries/client/views/form-gallery.client.view.html',
//        controller: 'GalleriesController',
//        controllerAs: 'vm',
//        resolve: {
//          galleryResolve: getGallery
//        },
//        data: {
//          roles: ['user', 'admin'],
//          pageTitle: 'Edit Gallery {{ galleryResolve.name }}'
//        }
//      })
//      .state('galleries.view', {
//        url: '/:galleryId',
//        templateUrl: 'modules/galleries/client/views/view-gallery.client.view.html',
//        controller: 'GalleriesController',
//        controllerAs: 'vm',
//        resolve: {
//          galleryResolve: getGallery
//        },
//        data: {
//          pageTitle: 'Gallery {{ galleryResolve.name }}'
//        }
//      });
  // }

 // getGallery.$inject = ['$stateParams', 'GalleriesService'];
 //
 // function getGallery($stateParams, GalleriesService) {
 //   return GalleriesService.get({
 //     galleryId: $stateParams.galleryId
 //   }).$promise;
 // }
 //
 // newGallery.$inject = ['GalleriesService'];
 //
 // function newGallery(GalleriesService) {
 //   return new GalleriesService();
  }
}());

(function () {
  'use strict';

  // Galleries controller
  angular
    .module('galleries')
    .controller('GalleriesController', GalleriesController);

  GalleriesController.$inject = ['$scope', '$state', '$window', 'Authentication'];

  function GalleriesController ($scope, $state, $window, Authentication, gallery) {
    var vm = this;

    vm.authentication = Authentication;
    vm.gallery = gallery;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Gallery
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.gallery.$remove($state.go('galleries.list'));
      }
    }

    // Save Gallery
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.galleryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.gallery._id) {
        vm.gallery.$update(successCallback, errorCallback);
      } else {
        vm.gallery.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('galleries.view', {
          galleryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    ///////////////

    $scope.albumName = 'Album Name';
    $scope.albumDate = 'December 31, 2017';
    $scope.albumDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit hendrerit diam, at condimentum sem lacinia at. Curabitur tincidunt malesuada sem non venenatis. Maecenas pulvinar.';
    
  }
}());

(function () {
  'use strict';

  angular
    .module('galleries')
    .controller('GalleriesListController', GalleriesListController);

  GalleriesListController.$inject = ['GalleriesService'];

  function GalleriesListController(GalleriesService) {
    var vm = this;

    vm.galleries = GalleriesService.query();
  }
}());

// Galleries service used to communicate Galleries REST endpoints
(function () {
  'use strict';

  angular
    .module('galleries')
    .factory('GalleriesService', GalleriesService);

  GalleriesService.$inject = ['$resource'];

  function GalleriesService($resource) {
    return $resource('api/galleries/:galleryId', {
      galleryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

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
      roles: ['*']
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

(function () {
  'use strict';

  angular
    .module('joins')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('joins', {
        // abstract: false,
        url: '/joins',
        controller: 'JoinsController',
        templateUrl: 'modules/joins/client/views/view-join.client.view.html',
        controllerAs: 'vm'
      })
      .state('payment', {
        url: '/payment',
        controller: 'JoinsController',
        templateUrl: 'modules/joins/client/views/payment-join.client.view.html'
      })

      .state('list', {
        url: '/list',
        templateUrl: 'modules/joins/client/views/list-joins.client.view.html',
        controller: 'JoinsListController',
        controllerAs: 'vm'
        // data: {
        //   pageTitle: 'List Pending Requests'
        // }
      })
      .state('joins.create', {
        url: '/create',
        templateUrl: 'modules/joins/client/views/form-join.client.view.html',
        controller: 'JoinsController',
        controllerAs: 'vm'
        // resolve: {
        //   joinResolve: newJoin
        // },
        // data: {
        //   roles: ['user', 'admin'],
        //   pageTitle: 'Joins Create'
        // }
      })
  //     .state('joins.edit', {
  //       url: '/:joinId/edit',
  //       templateUrl: 'modules/joins/client/views/form-join.client.view.html',
  //       controller: 'JoinsController',
  //       controllerAs: 'vm',
  //       resolve: {
  //         joinResolve: getJoin
  //       },
  //       data: {
  //         roles: ['user', 'admin'],
  //         pageTitle: 'Edit Join {{ joinResolve.name }}'
  //       }
  //     })
      .state('joins.view', {
        url: '/:joinId',
        templateUrl: 'modules/joins/client/views/list-join.client.view.html',
        controller: 'JoinsController',
        controllerAs: 'vm'
        // resolve: {
        //   joinResolve: getJoin
        // },
        // data: {
        //   pageTitle: 'Join {{ joinResolve.name }}'
        // }
      });
  }

  // getJoin.$inject = ['$stateParams', 'JoinsService'];
  //
  // function getJoin($stateParams, JoinsService) {
  //   return JoinsService.get({
  //     joinId: $stateParams.joinId
  //   }).$promise;
  // }
  //
  //
  // newJoin.$inject = ['JoinsService'];
  //
  // function newJoin(JoinsService) {
  //   return new JoinsService();
  // }
}());

(function () {
  'use strict';

  // Joins controller
  angular.module('joins').controller('JoinsController', JoinsController);

  JoinsController.$inject = ['$rootScope', '$scope', '$state', '$window', '$modal', '$location', 'Authentication'];

  function JoinsController ($rootScope, $scope, $state, $window, $modal, Authentication, join) {
    var vm = this;

    vm.authentication = Authentication;
    vm.join = join;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.fillApplication = fillApplication;


    //$scope variables prototypes
    $scope.myInterval = 3000;
    $scope.slides = [
      {
        image: 'modules/core/client/img/pictures/1.jpg',
        text: 'Recognition and Talent'
      },
      {
        image: 'modules/core/client/img/pictures/2.jpg',
        text: 'Hard Work'
      },
      {
        image: 'modules/core/client/img/pictures/3.jpg',
        text: 'Having Fun'
      },
      {
        image: 'modules/core/client/img/pictures/4.jpg',
        text: 'Panels and Discussion'
      }
    ];

     function fillApplication() {
         $state.go('pendingrequets.create');
    }

    // Remove existing Join
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.join.$remove($state.go('joins.list'));
      }
    }

    //Save Join
    function save(isValid) {
        console.log('In Save');
      if (!isValid) {
          console.log('Is Valid');

        $scope.$broadcast('show-errors-check-validity', 'vm.form.joinForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.join._id) {
        vm.join.$update(successCallback, errorCallback);
      } else {
        vm.join.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('joins.view', {
          joinId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }
  }
}());

angular.module('joins').controller('ModalController', ['$scope', function($scope) {

}]);

(function () {
  'use strict';

  angular
    .module('joins')
    .controller('JoinsListController', JoinsListController);

  JoinsListController.$inject = ['JoinsService'];

  function JoinsListController(JoinsService) {
    var vm = this;

    vm.joins = JoinsService.query();
  }
}());

// Joins service used to communicate Joins REST endpoints
(function () {
  'use strict';

  angular
    .module('joins')
    .factory('JoinsService', JoinsService);

  JoinsService.$inject = ['$resource'];

  function JoinsService($resource) {
    return $resource('api/joins/:joinId', {
      joinId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('members')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Members',
      state: 'members',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'members', {
      title: 'Profiles',
      state: 'profiles'
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('members')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('members', {
        //abstract: true,
        url: '/members',
        template: 'modules/members/client/views/view-member.client.view.html'
      })
      .state('profiles', {
        url: '/members/profiles',
        templateUrl: 'modules/members/client/views/view-profiles.client.view.html',
        controller: 'ProfilesController',
        controllerAs: 'vm'
      })
      .state('profilesModal', {
        url: '/members/profiles',
        templateUrl: 'modules/members/client/views/profiles-modal.client.view.html',
        controller: 'ProfilesController',
        controllerAs: 'vm'
      })


      .state('members.list', {
        url: '',
        templateUrl: 'modules/members/client/views/list-members.client.view.html',
        controller: 'MembersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Members List'
        }
      })
      .state('members.create', {
        url: '/create',
        templateUrl: 'modules/members/client/views/form-member.client.view.html',
        controller: 'MembersController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: newMember
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Members Create'
        }
      })
      .state('members.edit', {
        url: '/:memberId/edit',
        templateUrl: 'modules/members/client/views/form-member.client.view.html',
        controller: 'MembersController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Member {{ memberResolve.name }}'
        }
      })
      .state('members.view', {
        url: '/:memberId',
        templateUrl: 'modules/members/client/views/view-member.client.view.html',
        controller: 'MembersController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember
        },
        data: {
          pageTitle: 'Member {{ memberResolve.name }}'
        }
      });
  }

  getMember.$inject = ['$stateParams', 'MembersService'];

  function getMember($stateParams, MembersService) {
    return MembersService.get({
      memberId: $stateParams.memberId
    }).$promise;
  }

  newMember.$inject = ['MembersService'];

  function newMember(MembersService) {
    return new MembersService();
  }
}());

(function () {
  'use strict';

  angular
    .module('members')
    .controller('MembersListController', MembersListController);

  MembersListController.$inject = ['MembersService'];

  function MembersListController(MembersService) {
    var vm = this;

    vm.members = MembersService.query();
  }
}());

(function () {
  'use strict';

  // Members controller
  angular
    .module('members')
    .controller('MembersController', MembersController);

  MembersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'memberResolve'];

  function MembersController ($scope, $state, $window, Authentication, member) {
    var vm = this;

    vm.authentication = Authentication;
    vm.member = member;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Member
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.member.$remove($state.go('members.list'));
      }
    }

    // Save Member
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.memberForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.member._id) {
        vm.member.$update(successCallback, errorCallback);
      } else {
        vm.member.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('members.view', {
          memberId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

(function () {
    'use strict';
  
    // Profiles controller
    angular
      .module('members')
      .controller('ProfilesController', ProfilesController);
  
    ProfilesController.$inject = ['$scope', '$state', '$window', '$modal', '$log', 'MembersService', 'Authentication'];
  
    function ProfilesController ($scope, $state, $window, $modal, $log, MembersService, Authentication, member) {
      var vm = this;
      vm.member = member;
      vm.authentication = Authentication;
      $scope.user = Authentication.user;
      $scope.profiles = MembersService.query();

      $scope.ProfileUpdate = function(updatedProfile) {
        var profile = updatedProfile;
        profile.name = document.getElementById("name").value;
        profile.description = document.getElementById("description").value;

          profile.$update(function() {

          }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };

      $scope.ProfileAdd = function() {
          var newName = document.getElementById("name").value;
          var newDescription = document.getElementById("description").value;

          var profile = new MembersService({
            name: newName,
            description: newDescription
            });

            profile.$save(function() {
                
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            $state.reload();      //reloads the page
      };

      vm.delete = function(selectedProfile) {
        var profile = selectedProfile;

        if (confirm(profile.name + "\'s profile will be deleted.")) {
            profile.$delete(function() {
                
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            $state.reload();      //reloads the page
        }
      };

      vm.modalUpdate = function (selectedProfile, size) {
          var modalInstance = $modal.open({
              templateUrl: "modules/members/client/views/profiles-modal.client.view.html",
              controller: ["$scope", "$modalInstance", "profile", function ($scope, $modalInstance, profile) {
                  $scope.profile = profile;

                  $scope.ok = function() {
                      $modalInstance.close($scope.profile);
                  };
                  $scope.cancel = function() {
                      $modalInstance.dismiss('cancel');
                  };
              }],
              size: size,
               resolve: {
                   profile: function() {
                       return selectedProfile;
                   }
               }
          });

          modalInstance.result.then(function(selectedProfile) {
            $scope.selected = selectedProfile;
          }, function () {
              $log.info("Modal dismissed at: " + new Date());
          });
      };

      vm.modalEdit = function (selectedProfile, size) {
        var modalInstance = $modal.open({
            templateUrl: "modules/members/client/views/profiles-edit-modal.client.view.html",
            controller: ["$scope", "$modalInstance", "profile", function ($scope, $modalInstance, profile) {
                $scope.profile = profile;

                $scope.ok = function() {
                    $modalInstance.close($scope.profile);
                };
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            }],
            size: size,
             resolve: {
                 profile: function() {
                     return selectedProfile;
                 }
             }
        });

        modalInstance.result.then(function(selectedProfile) {
          $scope.selected = selectedProfile;
        }, function () {
            $log.info("Modal dismissed at: " + new Date());
        });
    };

    vm.modalAdd = function (size) {
        var modalInstance = $modal.open({
            templateUrl: "modules/members/client/views/profiles-add-modal.client.view.html",
            controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {
                $scope.ok = function() {
                    $modalInstance.close();
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            }],
            size: size,
             resolve: {
                 profile: function() {
                     
                 }
             }
        });

        modalInstance.result.then(function(selectedProfile) {
          $scope.selected = selectedProfile;
        }, function () {
            $log.info("Modal dismissed at: " + new Date());
        });
    };

    }
  }());

// Members service used to communicate Members REST endpoints
(function () {
  'use strict';

  angular
    .module('members')
    .factory('MembersService', MembersService);

  MembersService.$inject = ['$resource'];

  function MembersService($resource) {
    return $resource('api/members/:memberId', {
      memberId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('miscs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('miscs', {
        abstract: true,
        url: '/miscs',
        template: '<ui-view/>'
      })
      .state('miscs.list', {
        url: '',
        templateUrl: 'modules/miscs/client/views/list-miscs.client.view.html',
        controller: 'MiscsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Miscs List'
        }
      })
      .state('miscs.create', {
        url: '/create',
        templateUrl: 'modules/miscs/client/views/form-misc.client.view.html',
        controller: 'MiscsController',
        controllerAs: 'vm',
        resolve: {
          miscResolve: newMisc
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Miscs Create'
        }
      })
      .state('miscs.edit', {
        url: '/:miscId/edit',
        templateUrl: 'modules/miscs/client/views/form-misc.client.view.html',
        controller: 'MiscsController',
        controllerAs: 'vm',
        resolve: {
          miscResolve: getMisc
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Misc {{ miscResolve.name }}'
        }
      })
      .state('miscs.view', {
        url: '/:miscId',
        templateUrl: 'modules/miscs/client/views/view-misc.client.view.html',
        controller: 'MiscsController',
        controllerAs: 'vm',
        resolve: {
          miscResolve: getMisc
        },
        data: {
          pageTitle: 'Misc {{ miscResolve.name }}'
        }
      });
  }

  getMisc.$inject = ['$stateParams', 'MiscsService'];

  function getMisc($stateParams, MiscsService) {
    return MiscsService.get({
      miscId: $stateParams.miscId
    }).$promise;
  }

  newMisc.$inject = ['MiscsService'];

  function newMisc(MiscsService) {
    return new MiscsService();
  }
}());

(function () {
  'use strict';

  angular
    .module('miscs')
    .controller('MiscsListController', MiscsListController);

  MiscsListController.$inject = ['MiscsService'];

  function MiscsListController(MiscsService) {
    var vm = this;

    vm.miscs = MiscsService.query();
  }
}());

(function () {
  'use strict';

  // Miscs controller
  angular
    .module('miscs')
    .controller('MiscsController', MiscsController);

  MiscsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'miscResolve'];

  function MiscsController ($scope, $state, $window, Authentication, misc) {
    var vm = this;

    vm.authentication = Authentication;
    vm.misc = misc;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.misc.data = [];
    $scope.p1 = '';
    $scope.p2 = '';
    $scope.p3 = '';
    //var updateContent = [];

    // Remove existing Misc
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.misc.$remove($state.go('miscs.list'));
      }
    }

    // Save Misc
    function save() {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.miscForm');
      //   return false;
      // }

      if($scope.p1 !== '') {
        vm.misc.data.push($scope.p1);
      }
      if($scope.p2 !== '') {
        vm.misc.data.push($scope.p2);
      }
      if($scope.p3 !== '') {
        vm.misc.data.push($scope.p3);
      }

      //vm.misc.data = ['HI', 'BYE'];
      //updateContent = [];
      //vm.misc.name = 'TESTY TEST';

      $scope.p1 = '';
      $scope.p2 = '';
      $scope.p3 = '';

      // TODO: move create/update logic to service
      if (vm.misc._id) {
        vm.misc.$update(successCallback, errorCallback);
      } else {
        vm.misc.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('home', {
          miscId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

// Miscs service used to communicate Miscs REST endpoints
(function () {
  'use strict';

  angular
    .module('miscs')
    .factory('MiscsService', MiscsService);

  MiscsService.$inject = ['$resource'];

  function MiscsService($resource) {
    return $resource('api/miscs/:miscId', {
      miscId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

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
      roles: ['*']
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

(function () {
  'use strict';

  angular
    .module('newabouts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('newabouts', {
        abstract: true,
        url: '/about',
        template: '<ui-view/>'
      })
      .state('newabouts.list', {
        url: '',
        templateUrl: 'modules/newabouts/client/views/list-newabouts.client.view.html',
        controller: 'NewaboutsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Newabouts List'
        }
      })
      .state('newabouts.create', {
        url: '/create',
        templateUrl: 'modules/newabouts/client/views/form-newabout.client.view.html',
        controller: 'NewaboutsController',
        controllerAs: 'vm',
        resolve: {
          newaboutResolve: newNewabout
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Newabouts Create'
        }
      })
      .state('newabouts.edit', {
        url: '/:newaboutId/edit',
        templateUrl: 'modules/newabouts/client/views/form-newabout.client.view.html',
        controller: 'NewaboutsController',
        controllerAs: 'vm',
        resolve: {
          newaboutResolve: getNewabout
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Newabout {{ newaboutResolve.name }}'
        }
      })
      .state('newabouts.view', {
        url: '/:newaboutId',
        templateUrl: 'modules/newabouts/client/views/view-newabout.client.view.html',
        controller: 'NewaboutsController',
        controllerAs: 'vm',
        resolve: {
          newaboutResolve: getNewabout
        },
        data: {
          pageTitle: 'Newabout {{ newaboutResolve.name }}'
        }
      })
      .state('newabouts.madelynAward', {
        url: '/madelynAward',
        templateUrl: 'modules/newabouts/client/views/madelynAward-newabouts.client.view.html',
        controller: 'NewaboutsListController',
        controllerAs: 'vm'
      })
      .state('newabouts.distinctionAward', {
        url: '/distinctionAward',
        templateUrl: 'modules/newabouts/client/views/distinctionAward-newabout.client.view.html',
        controller: 'NewaboutsListController',
        controllerAs: 'vm'
      });
  }

  getNewabout.$inject = ['$stateParams', 'NewaboutsService'];

  function getNewabout($stateParams, NewaboutsService) {
    return NewaboutsService.get({
      newaboutId: $stateParams.newaboutId
    }).$promise;
  }

  newNewabout.$inject = ['NewaboutsService'];

  function newNewabout(NewaboutsService) {
    return new NewaboutsService();
  }
}());

angular.module('newabouts')
  .directive('ycSidebarAffix', ["$window", function($window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var orignOffsetTop = element[0].offsetTop;
        scope.condition = function() {
          return $window.pageYOffset > orignOffsetTop + 125;
        };

        angular.element($window).bind('scroll', function() {
          scope.$apply(function() {
            if (scope.condition()) {
              angular.element(element).addClass('sidebar-affix');
            } else {
              angular.element(element).removeClass('sidebar-affix');
            }
          });
        });
      }
    };
  }]);

(function () {
  'use strict';

  angular
    .module('newabouts')
    .controller('NewaboutsListController', NewaboutsListController);

  NewaboutsListController.$inject = ['$scope', 'NewaboutsService', 'Authentication'];

  function NewaboutsListController($scope, NewaboutsService, Authentication) {
    var vm = this;
    $scope.user = Authentication.user;
    $scope.aboutsData = NewaboutsService.query();
    $scope.ids = ['mission', 'people', 'awards', 'history'];

    vm.newabouts = NewaboutsService.query();
  }
}());

(function () {
  'use strict';

  // Newabouts controller
  angular
    .module('newabouts')
    .controller('NewaboutsController', NewaboutsController);

  NewaboutsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$log', '$modal','newaboutResolve'];

  function NewaboutsController ($scope, $state, $window, Authentication, $log, $modal, newabout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.newabout = newabout;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.newabout.text = [];
    vm.newabout.titles = ['MISSION', 'LEADERSHIP', 'AWARDS', 'Woman of Distinction Award', 'HISTORY'];
    $scope.p1 = '';
    $scope.p2 = '';
    $scope.p3 = '';
    //$scope.aboutsData = NewaboutsService.query();
    //$scope.user = Authentication.user;

    $scope.show = false;
    $scope.showMission = false;
    $scope.showAwards = false;
    $scope.showWOD_Awards = false;
    $scope.showLeadership = false;
    $scope.showHistory = false;

    // $scope.titles = ['MISSION', 'LEADERSHIP', 'AWARDS', 'Woman of Distinction Award', 'HISTORY'];
    $scope.hello = "Hello World";
    // Remove existing Newabout

    $scope.edit = function() {
      //modalUpdate(0);
      $scope.show = true;
      $scope.p1 = '';
      $scope.p2 = '';
      $scope.p3 = '';

    };


    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.newabout.$remove($state.go('newabouts.list'));
      }
    }


    // Save Newabout
    function save(isValid) {
      console.log('IN SAVE');
      console.log(vm.newabout);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newaboutForm');
        return false;
      }
      if($scope.p1 !== '') {
        vm.newabout.text.push($scope.p1);
      }
      if($scope.p2 !== '') {
        vm.newabout.text.push($scope.p2);
      }
      if($scope.p3 !== '') {
        vm.newabout.text.push($scope.p3);
      }
      // TODO: move create/update logic to service
      if (vm.newabout._id) {
        vm.newabout.$update(successCallback, errorCallback);
      } else {
        vm.newabout.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('newabouts.list', {
          newaboutId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

// Newabouts service used to communicate Newabouts REST endpoints
(function () {
  'use strict';

  angular
    .module('newabouts')
    .factory('NewaboutsService', NewaboutsService);

  NewaboutsService.$inject = ['$resource'];

  function NewaboutsService($resource) {
    return $resource('api/newabouts/:newaboutId', {
      newaboutId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('news')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'News',
      state: 'news',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'news', {
      title: 'List News',
      state: 'news.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'news', {
      title: 'Create News',
      state: 'news.create'
      //roles: ['user']
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('news')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('news', {
        abstract: true,
        url: '/news',
        template: '<ui-view/>'
      })
      .state('news.list', {
        url: '',
        templateUrl: 'modules/news/client/views/list-news.client.view.html',
        controller: 'NewsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'News List'
        }
      })
      .state('news.create', {
        url: '/create',
        templateUrl: 'modules/news/client/views/form-news.client.view.html',
        controller: 'NewsController',
        controllerAs: 'vm',
        resolve: {
          newsResolve: newNews
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'News Create'
        }
      })
      .state('news.edit', {
        url: '/:newsId/edit',
        templateUrl: 'modules/news/client/views/form-news.client.view.html',
        controller: 'NewsController',
        controllerAs: 'vm',
        resolve: {
          newsResolve: getNews
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit News {{ newsResolve.name }}'
        }
      })
      .state('news.view', {
        url: '/:newsId',
        templateUrl: 'modules/news/client/views/view-news.client.view.html',
        controller: 'NewsController',
        controllerAs: 'vm',
        resolve: {
          newsResolve: getNews
        },
        data: {
          pageTitle: 'News {{ newsResolve.name }}'
        }
      });
  }

  getNews.$inject = ['$stateParams', 'NewsService'];

  function getNews($stateParams, NewsService) {
    return NewsService.get({
      newsId: $stateParams.newsId
    }).$promise;
  }

  newNews.$inject = ['NewsService'];

  function newNews(NewsService) {
    return new NewsService();
  }
}());

(function () {
  'use strict';

  angular
    .module('news')
    .controller('NewsListController', NewsListController);

  NewsListController.$inject = ['$scope', 'NewsService', 'Authentication'];

  function NewsListController($scope, NewsService, Authentication) {
    var vm = this;
    $scope.user = Authentication.user;
    vm.news = NewsService.query();
  }
}());

(function () {
  'use strict';

  // News controller
  angular
    .module('news')
    .controller('NewsController', NewsController);

  NewsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'newsResolve', 'Admin'];

  function NewsController ($scope, $state, $window, Authentication, news, Admin) {
    var vm = this;
    $scope.usersList = Admin.query();
    $scope.user = 'HI';
    $scope.currUserRole = Authentication.user.roles[0];
    vm.authentication = Authentication;
    vm.news = news;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    //console.log($scope.user.roles[0]);

    // Remove existing News
    function remove() {
      if ($window.confirm('Are you sure you want to delete ' + '"' + vm.news.name + '"?')) {
        vm.news.$remove($state.go('news.list'));
      }
    }

    // Save News
    function save(isValid) {
      console.log($scope.usersList);
      console.log(vm.authentication);
      console.log($scope.currUserRole);
      console.log(news);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newsForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.news._id) {
        vm.news.$update(successCallback, errorCallback);
      } else {
        vm.news.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('news.list', {
          newsId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

// News service used to communicate News REST endpoints
(function () {
  'use strict';

  angular
    .module('news')
    .factory('NewsService', NewsService);

  NewsService.$inject = ['$resource'];

  function NewsService($resource) {
    return $resource('api/news/:newsId', {
      newsId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items

    Menus.addMenuItem('topbar', {
      title: 'List of Members',
      state: 'pendingrequets.list',
      // type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'pendingrequets', {
      title: 'Join Now',
      state: 'pendingrequets.create',
      // roles: ['*']
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pendingrequets', {
        //abstract: true,
        url: '/pendingrequets',
        template: '<ui-view/>'
      })
      .state('pendingrequets.list', {
        url: '/list',
        templateUrl: 'modules/pendingrequets/client/views/list-pendingrequets.client.view.html',
        controller: 'PendingrequetsListController',
        controllerAs: 'vm',
        resolve: {
          pendingrequetResolve: getPendingrequets
        },
        data: {
          pageTitle: 'Pendingrequets List',
          roles: ['admin']
        }
      })
      .state('pendingrequets.create', {
        url: '/create',
        templateUrl: 'modules/pendingrequets/client/views/form-pendingrequet.client.view.html',
        controller: 'PendingrequetsController',
        controllerAs: 'vm',
        resolve: {
          pendingrequetResolve: newPendingrequet
        },
        data: {
          // roles: [''],
          pageTitle: 'Pendingrequets Create'
        }
      })
      // .state('pendingrequets.edit', {
      //   url: '/:pendingrequetId/edit',
      //   templateUrl: 'modules/pendingrequets/client/views/form-pendingrequet.client.view.html',
      //   controller: 'PendingrequetsController',
      //   controllerAs: 'vm',
      //   resolve: {
      //     pendingrequetResolve: getPendingrequet
      //   },
      //   data: {
      //     roles: ['user', 'admin'],
      //     pageTitle: 'Edit Pendingrequet {{ pendingrequetResolve.name }}'
      //   }
      // })
      .state('pendingrequets.view', {
        url: '/:pendingrequetId',
        templateUrl: 'modules/pendingrequets/client/views/view-pendingrequet.client.view.html',
        controller: 'PendingrequetsController',
        controllerAs: 'vm',
        resolve: {
          pendingrequetResolve: getPendingrequet
        },
        data: {
          pageTitle: 'Pendingrequet {{ pendingrequetResolve.name }}',
          roles: ['admin']
        }
      });
  }

  getPendingrequet.$inject = ['$stateParams', 'PendingrequetsService'];

  function getPendingrequet($stateParams, PendingrequetsService) {
    return PendingrequetsService.get({
      pendingrequetId: $stateParams.pendingrequetId
    }).$promise;
  }

    getPendingrequets.$inject = ['PendingrequetsService'];

  function getPendingrequets(PendingrequetsService) {
    return PendingrequetsService.query().$promise;
  }

  newPendingrequet.$inject = ['PendingrequetsService'];

  function newPendingrequet(PendingrequetsService) {
    return new PendingrequetsService();
  }
}());

(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .controller('PendingrequetsListController', PendingrequetsListController);

  PendingrequetsListController.$inject = ['PendingrequetsService'];

  function PendingrequetsListController(PendingrequetsService) {
    var vm = this;

    vm.pendingrequets = PendingrequetsService.query();
  }
}());

(function () {
  'use strict';

  // Pendingrequets controller
  angular
    .module('pendingrequets')
    .controller('PendingrequetsController', PendingrequetsController);

  PendingrequetsController.$inject = ['$scope', '$state', '$window', '$modal', '$timeout', '$location', '$http', 'Authentication', 'FileUploader', 'pendingrequetResolve'];

  function PendingrequetsController ($scope, $state, $window, $modal, $timeout, $location, $http, Authentication, FileUploader, pendingrequet) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pendingrequet = pendingrequet;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

  $scope.clicked = function () {
      if(vm.pendingrequet.selection4) {
          $scope.showForm = true;
      } else {
          $scope.showForm = false;
          vm.pendingrequet.interest = '';
          vm.pendingrequet.motivation = '';
      }
  };

    //this function open a modal that allows user to create an account and go to pay
    $scope.goToPay = function () {

      $modal.open ({
        templateUrl: 'modules/joins/client/views/modal-join.client.view.html',
        controller:'JoinsController'

      }).result.then(function () {
            //Redirecting to client's current payment page
        // var url = 'https://squareup.com/store/UFLAAW';
        //$window.open(url);
        $window.location.href = 'https://squareup.com/store/UFLAAW';

    });


    };


    $scope.cancelForm = function () {
      $state.go('joins');
    };


  /*
  * Upload images.
  */
  $scope.fillFields = function () {
      if (vm.pendingrequet.imageURL && vm.pendingrequet.imageURL !== './modules/pendingrequets/client/img/memberImages/uploads/') {
        $scope.imageURL = vm.pendingrequet.imageURL;
      }
      else {
        $scope.imageURL = './modules/pendingrequets/client/img/memberImages/default.png';
        console.log($scope.imageURL);
      }
  };
  // Create file uploader instance
  $scope.uploader = new FileUploader({
      url: '/api/pendingrequets/picture',
      alias: 'newMemberPicture'
  });

  // Set file uploader image filter
  $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
  });
  // Function called after the user selected a new picture file
  $scope.uploader.onAfterAddingFile = function (fileItem) {
      console.log("onAfterAddingFile");
      if ($window.FileReader) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(fileItem._file);
          fileReader.onload = function (fileReaderEvent) {
              $timeout(function () {
                  $scope.imageURL = fileReaderEvent.target.result;

                  // Upload the new selected picture.
                  $scope.uploadPicture();
              }, 0);
          };
      }
  };

  // Called after the user has successfully uploaded a new picture
  $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      console.log("onSuccessItem");

      // Show success message
      $scope.success = true;

      // Populate user object
      vm.pendingrequet.filename = response.file.filename;
      vm.pendingrequet.imageURL = response.file.filename;

      console.log("filename: " + vm.pendingrequet.filename);
  };

  // Called after the user has failed to uploaded a new picture
  $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
  };


  // Change upcoming member picture
  $scope.uploadPicture = function () {
      console.log("upload Picture");

      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
  };

  // Cancel the upload process
  $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      // $scope.imageURL = '';
  };



    // Remove existing Pendingrequet
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pendingrequet.$remove($state.go('pendingrequets.list'));
      }
    }

  // Save Pendingrequet
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pendingrequetForm');
        return false;
      }


      // TODO: move create/update logic to service
      if (vm.pendingrequet._id) {
        vm.pendingrequet.$update(successCallback, errorCallback);
      } else {
        vm.pendingrequet.$save(successCallback, errorCallback);
      }

      function successCallback(res) {


       //Sending email to notify the admin about a new member application
       var data = ({

           contactName: vm.pendingrequet.name,
           contactEmail: vm.pendingrequet.email,
           contactMsg: 'This email is to notify you that ' + vm.pendingrequet.name + ' has submitted a new membership application.' +
           ' Does the new member want a PROFILE? ' + vm.pendingrequet.selection4 + '. Please, review the required fields in the application.'

       });

       $http.post('/api/auth/notification', data).success(function (data, status, headers, config) {
           $state.go('pendingrequets.form', {
               pendingrequetId: res._id
           });
       }).error(function (data, status, headers, config) {
           console.log('Error sending the email');
       });

        // $state.go('pendingrequets.view', {
        //   pendingrequetId: res._id
        // });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

// Pendingrequets service used to communicate Pendingrequets REST endpoints
(function () {
  'use strict';

  angular
    .module('pendingrequets')
    .factory('PendingrequetsService', PendingrequetsService);

  PendingrequetsService.$inject = ['$resource'];

  function PendingrequetsService($resource) {
    return $resource('api/pendingrequets/:pendingrequetId', {
      pendingrequetId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go('home');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go('home');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
