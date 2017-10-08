(function () {
  'use strict';

  describe('Calendars Controller Tests', function () {
    // Initialize global variables
    var CalendarsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CalendarsService,
      mockCalendar;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CalendarsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CalendarsService = _CalendarsService_;

      // create mock Calendar
      mockCalendar = new CalendarsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Calendar Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Calendars controller.
      CalendarsController = $controller('CalendarsController as vm', {
        $scope: $scope,
        calendarResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleCalendarPostData;

      beforeEach(function () {
        // Create a sample Calendar object
        sampleCalendarPostData = new CalendarsService({
          name: 'Calendar Name'
        });

        $scope.vm.calendar = sampleCalendarPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CalendarsService) {
        // Set POST response
        $httpBackend.expectPOST('api/calendars', sampleCalendarPostData).respond(mockCalendar);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Calendar was created
        expect($state.go).toHaveBeenCalledWith('calendars.view', {
          calendarId: mockCalendar._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/calendars', sampleCalendarPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Calendar in $scope
        $scope.vm.calendar = mockCalendar;
      });

      it('should update a valid Calendar', inject(function (CalendarsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/calendars\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('calendars.view', {
          calendarId: mockCalendar._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (CalendarsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/calendars\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Calendars
        $scope.vm.calendar = mockCalendar;
      });

      it('should delete the Calendar and redirect to Calendars', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/calendars\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('calendars.list');
      });

      it('should should not delete the Calendar and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
