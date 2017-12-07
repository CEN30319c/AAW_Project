'use strict';

angular.module('core').controller('HomeController', ['$scope','$modal', '$log', 'Authentication', 'NewsService', 'CalendarsService', 'MiscsService',
  function ($scope, $modal, $log, Authentication, NewsService, CalendarsService, MiscsService) { // The controller header/function parameters allows for the services defined in different modules to be injected.
    var vm = this;
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    //$scope.whoweareText = 'AAW strives to empower UF women for the utmost success in each stage of their careers at the university.';
    $scope.myInterval = 3000;
    $scope.slides = [ //used for carousel
      {
        image: 'modules/core/client/img/pictures/slide5.png'
      }
    ];
    $scope.miscData = MiscsService.query(); //loads home page content from MiscsService, which queries database
    $scope.newslist = NewsService.query(); //loads news listings from NewsService, which queries database
    $scope.calendarlist = CalendarsService.query(); //loads event listings from CalendarService, which queries database

    $scope.modalHomeEdit = function (misc, size) { //functioned called when user presses edit button on home page
      console.log('IN FUNCTION');
      var modalInstance = $modal.open({
          templateUrl: 'modules/miscs/client/views/misc-editHome-modal-client.view.html', //modal loaded from view in miscs module
          controller: function ($scope, $modalInstance, misc) {
              $scope.misc = misc;

              $scope.ok = function() {
                  $modalInstance.dismiss('cancel');

              };
              $scope.cancel = function() {
                  $modalInstance.dismiss('cancel');
              };
          },
          size: size,
           resolve: {
               misc: function() {
                   return misc;
               }
           }
      });

      modalInstance.result.then(function(misc) {
        $scope.selected = misc;
      }, function () {
          $log.info('Modal dismissed at: ' + new Date());
      });
  };

  }

]);

angular.module('core').filter('monthName', [function() { //filter used to display correct month name based on month number returned from calendar query
  return function (monthNumber) { //1 = January
    var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December' ];
    return monthNames[monthNumber - 1];
  };
}]);
