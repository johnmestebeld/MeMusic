angular.module('memusic.controllers', [])
 
// To prevent errors
.controller('PlaylistCtrl', function(){})
 
.controller('ListsCtrl', function($scope, $ionicPlatform, $cordovaOauth, Spotify) {
  var clientId = '751c9b62e801405c95a0c6595456c328';
  $scope.playlists = [];
 
    $scope.performLogin = function() {
      $cordovaOauth.spotify(clientId, ['user-read-private', 'playlist-read-private']).then(function(result) {
        window.localStorage.setItem('spotify-token', result.access_token);
        Spotify.setAuthToken(result.access_token);
        $scope.updateInfo();
      }, function(error) {
          console.log("Error -> " + error);
      });
    };
 
    $scope.updateInfo = function() {
      Spotify.getCurrentUser().then(function (data) {
        $scope.getUserPlaylists(data.id);
      }, function(error) {
        $scope.performLogin();
      });
    };
 
    $ionicPlatform.ready(function() {
      var storedToken = window.localStorage.getItem('spotify-token');
      if (storedToken !== null) {
        Spotify.setAuthToken(storedToken);
        $scope.updateInfo();
      } else {
        $scope.performLogin();
      }
    });
 
    $scope.getUserPlaylists = function(userid) {
      Spotify.getUserPlaylists(userid).then(function (data) {
        $scope.playlists = data.items;
      });
    };
})