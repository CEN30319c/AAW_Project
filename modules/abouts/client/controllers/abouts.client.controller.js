(function () {
  'use strict';

  // Abouts controller
  angular
    .module('abouts')
    .controller('AboutsController', AboutsController);

  AboutsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'AboutsService'];
  /*Menu-toggle*/
  // $("#menu-toggle").click(function(e) {
  //   e.preventDefault();
  //   $("#wrapper").toggleClass("active");
  // });



  /*Smooth link animation*/
  // $('a[href*=#]:not([href=#])').click(function() {
  //     if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

  //         var target = $(this.hash);
  //         target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
  //         if (target.length) {
  //             $('html,body').animate({
  //                 scrollTop: target.offset().top
  //             }, 1000);
  //             return false;
  //         }
  //     }
  // });


  function AboutsController ($scope, $state, $window, Authentication, AboutsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.abouts = AboutsService.query();
    vm.error = null;
    vm.form = {};
    // vm.remove = remove;
    // vm.save = save;


    // // Remove existing About
    // function remove() {
    //   if ($window.confirm('Are you sure you want to delete?')) {
    //     vm.about.$remove($state.go('abouts.list'));
    //   }
    // }

    // // Save About
    // function save(isValid) {
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'vm.form.aboutForm');
    //     return false;
    //   }

    //   // TODO: move create/update logic to service
    //   if (vm.about._id) {
    //     vm.about.$update(successCallback, errorCallback);
    //   } else {
    //     vm.about.$save(successCallback, errorCallback);
    //   }

    //   function successCallback(res) {
    //     $state.go('abouts.view', {
    //       aboutId: res._id
    //     });
    //   }

    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }
    // }

  }
}());
