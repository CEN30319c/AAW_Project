(function () {
  'use strict';

  // News controller
  angular
    .module('news')
    .controller('NewsController', NewsController);

  NewsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'newsResolve', 'Admin'];

  function NewsController ($scope, $state, $window, Authentication, news, Admin) {
    var vm = this;
    //$scope.auth = Authentication.query();
    $scope.usersList = Admin.query();
    $scope.currUserRole = Authentication.user.roles[0];
    vm.authentication = Authentication;
    vm.news = news;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
