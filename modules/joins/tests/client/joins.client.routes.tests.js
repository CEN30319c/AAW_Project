(function () {
  'use strict';

  describe('Joins Route Tests', function () {
    // Initialize global variables
    var $scope,
      JoinsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _JoinsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      JoinsService = _JoinsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('joins');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/joins');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          JoinsController,
          mockJoin;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('joins.view');
          $templateCache.put('modules/joins/client/views/view-join.client.view.html', '');

          // create mock Join
          mockJoin = new JoinsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Join Name'
          });

          // Initialize Controller
          JoinsController = $controller('JoinsController as vm', {
            $scope: $scope,
            joinResolve: mockJoin
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:joinId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.joinResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            joinId: 1
          })).toEqual('/joins/1');
        }));

        it('should attach an Join to the controller scope', function () {
          expect($scope.vm.join._id).toBe(mockJoin._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/joins/client/views/view-join.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          JoinsController,
          mockJoin;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('joins.create');
          $templateCache.put('modules/joins/client/views/form-join.client.view.html', '');

          // create mock Join
          mockJoin = new JoinsService();

          // Initialize Controller
          JoinsController = $controller('JoinsController as vm', {
            $scope: $scope,
            joinResolve: mockJoin
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.joinResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/joins/create');
        }));

        it('should attach an Join to the controller scope', function () {
          expect($scope.vm.join._id).toBe(mockJoin._id);
          expect($scope.vm.join._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/joins/client/views/form-join.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          JoinsController,
          mockJoin;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('joins.edit');
          $templateCache.put('modules/joins/client/views/form-join.client.view.html', '');

          // create mock Join
          mockJoin = new JoinsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Join Name'
          });

          // Initialize Controller
          JoinsController = $controller('JoinsController as vm', {
            $scope: $scope,
            joinResolve: mockJoin
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:joinId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.joinResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            joinId: 1
          })).toEqual('/joins/1/edit');
        }));

        it('should attach an Join to the controller scope', function () {
          expect($scope.vm.join._id).toBe(mockJoin._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/joins/client/views/form-join.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
