var app = angular.module('app', []);

app.config(function() {
  console.log("Hello from app.js");
});


app.controller('announcementCtrl', function($scope, $http) {


  $scope.title = '';
  $scope.author = '';
  $scope.text = '';
  $scope.announcements = [];

  $scope.getAll = function() {
    $http.get('/api/listAnnouncements').then(function(data) {
      console.log(data);
    });
  }

  $scope.postAnnouncement = function() {
    console.log("In postAnnouncement function");

    var ann = {
      title: $scope.title,
      author: $scope.author,
      announcement: $scope.text
    };

    $http.post('/api/announ', ann).then(function(data) {
      console.log(data.data.success);
      console.log(data.data.message);
    });
  }


});
//console.log("Hello From App.js");
