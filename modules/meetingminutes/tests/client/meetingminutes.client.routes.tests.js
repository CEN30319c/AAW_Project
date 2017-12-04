(function () {
  'use strict';

  describe('Meetingminutes Route Tests', function () {
    // Initialize global variables
    var $scope,
      MeetingminutesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MeetingminutesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MeetingminutesService = _MeetingminutesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('meetingminutes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/meetingminutes');
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
          MeetingminutesController,
          mockMeetingminute;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('meetingminutes.view');
          $templateCache.put('modules/meetingminutes/client/views/view-meetingminute.client.view.html', '');

          // create mock Meetingminute
          mockMeetingminute = new MeetingminutesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Meetingminute Name'
          });

          // Initialize Controller
          MeetingminutesController = $controller('MeetingminutesController as vm', {
            $scope: $scope,
            meetingminuteResolve: mockMeetingminute
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:meetingminuteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.meetingminuteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            meetingminuteId: 1
          })).toEqual('/meetingminutes/1');
        }));

        it('should attach an Meetingminute to the controller scope', function () {
          expect($scope.vm.meetingminute._id).toBe(mockMeetingminute._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/meetingminutes/client/views/view-meetingminute.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MeetingminutesController,
          mockMeetingminute;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('meetingminutes.create');
          $templateCache.put('modules/meetingminutes/client/views/form-meetingminute.client.view.html', '');

          // create mock Meetingminute
          mockMeetingminute = new MeetingminutesService();

          // Initialize Controller
          MeetingminutesController = $controller('MeetingminutesController as vm', {
            $scope: $scope,
            meetingminuteResolve: mockMeetingminute
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.meetingminuteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/meetingminutes/create');
        }));

        it('should attach an Meetingminute to the controller scope', function () {
          expect($scope.vm.meetingminute._id).toBe(mockMeetingminute._id);
          expect($scope.vm.meetingminute._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/meetingminutes/client/views/form-meetingminute.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MeetingminutesController,
          mockMeetingminute;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('meetingminutes.edit');
          $templateCache.put('modules/meetingminutes/client/views/form-meetingminute.client.view.html', '');

          // create mock Meetingminute
          mockMeetingminute = new MeetingminutesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Meetingminute Name'
          });

          // Initialize Controller
          MeetingminutesController = $controller('MeetingminutesController as vm', {
            $scope: $scope,
            meetingminuteResolve: mockMeetingminute
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:meetingminuteId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.meetingminuteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            meetingminuteId: 1
          })).toEqual('/meetingminutes/1/edit');
        }));

        it('should attach an Meetingminute to the controller scope', function () {
          expect($scope.vm.meetingminute._id).toBe(mockMeetingminute._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/meetingminutes/client/views/form-meetingminute.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
