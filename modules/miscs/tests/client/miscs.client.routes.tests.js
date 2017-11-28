(function () {
  'use strict';

  describe('Miscs Route Tests', function () {
    // Initialize global variables
    var $scope,
      MiscsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MiscsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MiscsService = _MiscsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('miscs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/miscs');
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
          MiscsController,
          mockMisc;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('miscs.view');
          $templateCache.put('modules/miscs/client/views/view-misc.client.view.html', '');

          // create mock Misc
          mockMisc = new MiscsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Misc Name'
          });

          // Initialize Controller
          MiscsController = $controller('MiscsController as vm', {
            $scope: $scope,
            miscResolve: mockMisc
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:miscId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.miscResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            miscId: 1
          })).toEqual('/miscs/1');
        }));

        it('should attach an Misc to the controller scope', function () {
          expect($scope.vm.misc._id).toBe(mockMisc._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/miscs/client/views/view-misc.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MiscsController,
          mockMisc;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('miscs.create');
          $templateCache.put('modules/miscs/client/views/form-misc.client.view.html', '');

          // create mock Misc
          mockMisc = new MiscsService();

          // Initialize Controller
          MiscsController = $controller('MiscsController as vm', {
            $scope: $scope,
            miscResolve: mockMisc
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.miscResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/miscs/create');
        }));

        it('should attach an Misc to the controller scope', function () {
          expect($scope.vm.misc._id).toBe(mockMisc._id);
          expect($scope.vm.misc._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/miscs/client/views/form-misc.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MiscsController,
          mockMisc;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('miscs.edit');
          $templateCache.put('modules/miscs/client/views/form-misc.client.view.html', '');

          // create mock Misc
          mockMisc = new MiscsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Misc Name'
          });

          // Initialize Controller
          MiscsController = $controller('MiscsController as vm', {
            $scope: $scope,
            miscResolve: mockMisc
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:miscId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.miscResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            miscId: 1
          })).toEqual('/miscs/1/edit');
        }));

        it('should attach an Misc to the controller scope', function () {
          expect($scope.vm.misc._id).toBe(mockMisc._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/miscs/client/views/form-misc.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
