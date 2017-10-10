(function () {
  'use strict';

  // News controller
  angular
    .module('news')
    .controller('NewsController', NewsController);

  angular.module('news').factory('News', ['$http',
  function($http) {
    var methods = {
      getAll: function() {
        return $http.get('http://localhost:8080/api/listings');
      },

      create: function(news) {
        return $http.post('/api/news', news);
      },

      read: function(id) {
        return $http.get('http://localhost:8080/api/listings/' + id);
      },

      update: function(id, listing) {
        return $http.put('http://localhost:8080/api/listings/' + id, listing);
      },

      delete: function(id) {
        return $http.delete('http://localhost:8080/api/listings/' + id);
      }
    };

    return methods;
  }
]);

  NewsController.$inject = ['$scope', '$state', '$window','$http', 'Authentication', 'News'];
  //ModalDemoCtrl.$inject = ['$scope', '$uibModal', '$log', '$document'];

  function NewsController ($scope, $state, $window, $http, Authentication, news, News) {
    var vm = this;

    vm.authentication = Authentication;
    vm.news = news;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.isEdit = false;
    $scope.editIndex = 0;

    $scope.editTitle = '';
    $scope.editAuthor = '';
    $scope.editText = '';

    $scope.title = '';
    $scope.author = '';
    $scope.text = '';
    $scope.announcements = [{title:"TEST", author:"ME", announcement:"BLAH BLAH BLAH"}];

    $scope.postNews = function() {

      var ann = {
        title: $scope.title,
        author: $scope.author,
        announcement: $scope.text
      };

      //News.create(ann);

      $scope.title = '';
      $scope.author = '';
      $scope.text = '';



      $scope.announcements.push(ann);

      // $http.post('/api/news', ann).then(function(data) {
      //   console.log(data.data.success);
      //   console.log(data.data.message);
      // });



      console.log(ann);

    }

    $scope.editPost = function(index) {
      console.log(index);
      $scope.isEdit = true;
      $scope.editIndex = index;
    }

    $scope.cancelEdit = function() {
      $scope.isEdit = false;
    }

    $scope.rePost = function() {
      console.log($scope.announcements);
      var ann = {
        title: $scope.editTitle,
        author: $scope.editAuthor,
        announcement: $scope.editText
      };

      console.log(ann);
      //$scope.announcements[$scope.editIndex] = ann;

      $scope.isEdit = false;

      $scope.editTitle = '';
      $scope.editAuthor = '';
      $scope.editText = '';
    }

    // Remove existing News
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.news.$remove($state.go('news.list'));
      }
    }

    // Save News
    function save(isValid) {
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
        $state.go('news.view', {
          newsId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }

}());
