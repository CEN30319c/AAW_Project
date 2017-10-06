(function () {
  'use strict';

  describe('Galleries Route Tests', function () {
    // Initialize global variables
    var $scope,
      GalleriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _GalleriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      GalleriesService = _GalleriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('galleries');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/galleries');
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
          GalleriesController,
          mockGallery;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('galleries.view');
          $templateCache.put('modules/galleries/client/views/view-gallery.client.view.html', '');

          // create mock Gallery
          mockGallery = new GalleriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Gallery Name'
          });

          // Initialize Controller
          GalleriesController = $controller('GalleriesController as vm', {
            $scope: $scope,
            galleryResolve: mockGallery
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:galleryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.galleryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            galleryId: 1
          })).toEqual('/galleries/1');
        }));

        it('should attach an Gallery to the controller scope', function () {
          expect($scope.vm.gallery._id).toBe(mockGallery._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/galleries/client/views/view-gallery.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          GalleriesController,
          mockGallery;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('galleries.create');
          $templateCache.put('modules/galleries/client/views/form-gallery.client.view.html', '');

          // create mock Gallery
          mockGallery = new GalleriesService();

          // Initialize Controller
          GalleriesController = $controller('GalleriesController as vm', {
            $scope: $scope,
            galleryResolve: mockGallery
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.galleryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/galleries/create');
        }));

        it('should attach an Gallery to the controller scope', function () {
          expect($scope.vm.gallery._id).toBe(mockGallery._id);
          expect($scope.vm.gallery._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/galleries/client/views/form-gallery.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          GalleriesController,
          mockGallery;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('galleries.edit');
          $templateCache.put('modules/galleries/client/views/form-gallery.client.view.html', '');

          // create mock Gallery
          mockGallery = new GalleriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Gallery Name'
          });

          // Initialize Controller
          GalleriesController = $controller('GalleriesController as vm', {
            $scope: $scope,
            galleryResolve: mockGallery
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:galleryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.galleryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            galleryId: 1
          })).toEqual('/galleries/1/edit');
        }));

        it('should attach an Gallery to the controller scope', function () {
          expect($scope.vm.gallery._id).toBe(mockGallery._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/galleries/client/views/form-gallery.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
