(function () {
  'use strict';

  describe('Tests Route Tests', function () {
    // Initialize global variables
    var $scope,
      TestsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TestsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TestsService = _TestsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tests');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tests');
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
          TestsController,
          mockTest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tests.view');
          $templateCache.put('modules/tests/client/views/view-test.client.view.html', '');

          // create mock Test
          mockTest = new TestsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Test Name'
          });

          // Initialize Controller
          TestsController = $controller('TestsController as vm', {
            $scope: $scope,
            testResolve: mockTest
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:testId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.testResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            testId: 1
          })).toEqual('/tests/1');
        }));

        it('should attach an Test to the controller scope', function () {
          expect($scope.vm.test._id).toBe(mockTest._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tests/client/views/view-test.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TestsController,
          mockTest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('tests.create');
          $templateCache.put('modules/tests/client/views/form-test.client.view.html', '');

          // create mock Test
          mockTest = new TestsService();

          // Initialize Controller
          TestsController = $controller('TestsController as vm', {
            $scope: $scope,
            testResolve: mockTest
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.testResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/tests/create');
        }));

        it('should attach an Test to the controller scope', function () {
          expect($scope.vm.test._id).toBe(mockTest._id);
          expect($scope.vm.test._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tests/client/views/form-test.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TestsController,
          mockTest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('tests.edit');
          $templateCache.put('modules/tests/client/views/form-test.client.view.html', '');

          // create mock Test
          mockTest = new TestsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Test Name'
          });

          // Initialize Controller
          TestsController = $controller('TestsController as vm', {
            $scope: $scope,
            testResolve: mockTest
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:testId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.testResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            testId: 1
          })).toEqual('/tests/1/edit');
        }));

        it('should attach an Test to the controller scope', function () {
          expect($scope.vm.test._id).toBe(mockTest._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tests/client/views/form-test.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
