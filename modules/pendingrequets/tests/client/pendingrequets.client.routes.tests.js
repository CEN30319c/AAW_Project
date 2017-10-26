(function () {
  'use strict';

  describe('Pendingrequets Route Tests', function () {
    // Initialize global variables
    var $scope,
      PendingrequetsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PendingrequetsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PendingrequetsService = _PendingrequetsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('pendingrequets');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/pendingrequets');
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
          PendingrequetsController,
          mockPendingrequet;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('pendingrequets.view');
          $templateCache.put('modules/pendingrequets/client/views/view-pendingrequet.client.view.html', '');

          // create mock Pendingrequet
          mockPendingrequet = new PendingrequetsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pendingrequet Name'
          });

          // Initialize Controller
          PendingrequetsController = $controller('PendingrequetsController as vm', {
            $scope: $scope,
            pendingrequetResolve: mockPendingrequet
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:pendingrequetId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.pendingrequetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            pendingrequetId: 1
          })).toEqual('/pendingrequets/1');
        }));

        it('should attach an Pendingrequet to the controller scope', function () {
          expect($scope.vm.pendingrequet._id).toBe(mockPendingrequet._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/pendingrequets/client/views/view-pendingrequet.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PendingrequetsController,
          mockPendingrequet;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('pendingrequets.create');
          $templateCache.put('modules/pendingrequets/client/views/form-pendingrequet.client.view.html', '');

          // create mock Pendingrequet
          mockPendingrequet = new PendingrequetsService();

          // Initialize Controller
          PendingrequetsController = $controller('PendingrequetsController as vm', {
            $scope: $scope,
            pendingrequetResolve: mockPendingrequet
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.pendingrequetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/pendingrequets/create');
        }));

        it('should attach an Pendingrequet to the controller scope', function () {
          expect($scope.vm.pendingrequet._id).toBe(mockPendingrequet._id);
          expect($scope.vm.pendingrequet._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/pendingrequets/client/views/form-pendingrequet.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PendingrequetsController,
          mockPendingrequet;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('pendingrequets.edit');
          $templateCache.put('modules/pendingrequets/client/views/form-pendingrequet.client.view.html', '');

          // create mock Pendingrequet
          mockPendingrequet = new PendingrequetsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pendingrequet Name'
          });

          // Initialize Controller
          PendingrequetsController = $controller('PendingrequetsController as vm', {
            $scope: $scope,
            pendingrequetResolve: mockPendingrequet
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:pendingrequetId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.pendingrequetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            pendingrequetId: 1
          })).toEqual('/pendingrequets/1/edit');
        }));

        it('should attach an Pendingrequet to the controller scope', function () {
          expect($scope.vm.pendingrequet._id).toBe(mockPendingrequet._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/pendingrequets/client/views/form-pendingrequet.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
