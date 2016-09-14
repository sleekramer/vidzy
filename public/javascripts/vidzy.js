(function () {
  function config($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      })
      .when('/add-video', {
        templateUrl: '/partials/video-form.html',
        controller: "AddVideoCtrl"
      })
      .when('/video/:id', {
        templateUrl: 'partials/video-form.html',
        controller: 'EditVideoCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

  function HomeCtrl ($scope, $resource) {
    var videos = $resource('/api/videos');
    videos.query(function (videos) {
      $scope.videos = videos;
    });
  }

  function AddVideoCtrl ($scope, $resource, $location) {
    $scope.save = function () {
      var videos = $resource('/api/videos');
      videos.save($scope.video, function() {
        $location.path('/');
      });
    };
  }

  function EditVideoCtrl ($scope, $resource, $location, $routeParams) {
    var videos = $resource('/api/videos/:id', { id: '@_id' }, {
      update: { method: 'PUT' }
    });

    videos.get({ id: $routeParams.id }, function(video) {
      $scope.video = video;
    });

    $scope.save = function () {
      videos.update($scope.video, function() {
        $location.path('/');
      });
    };

    $scope.delete = function () {
      if (confirm("Are you sure you want to delete this?")) {
        videos.delete({id: $routeParams.id}, function () {
          $location.path('/');
        });
      }
    };

  }



  angular.module('Vidzy', ['ngResource','ngRoute'])
  .config(['$routeProvider', config])
  .controller('HomeCtrl', ['$scope', '$resource', HomeCtrl])
  .controller('AddVideoCtrl',["$scope", "$resource", "$location", AddVideoCtrl])
  .controller('EditVideoCtrl', ["$scope", "$resource", "$location", "$routeParams", EditVideoCtrl]);
})();
