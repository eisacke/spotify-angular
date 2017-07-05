angular
  .module('spotifyApp')
  .controller('PlaylistsShowCtrl', PlaylistsShowCtrl);

PlaylistsShowCtrl.$inject = ['User', '$state', '$http'];
function PlaylistsShowCtrl(User, $state, $http) {
  const vm = this;
  User
    .get($state.params)
    .$promise
    .then((user) => {
      vm.user = user;
      getPlaylist();
    });

  function getPlaylist() {
    $http
      .get(`/api/users/${vm.user.spotifyId}/playlists/${$state.params.playlistId}`)
      .then((response) => {
        vm.playlist = response.data;
      });
  }

  function search() {
    $http
      .get('/api/spotify/search', { params: { q: vm.q }})
      .then((response) => {
        vm.results = response.data.tracks.items;
      });
  }

  vm.search = search;

  function addTrack(track) {
    $http
      .post(`/api/users/${vm.user.spotifyId}/playlists/${$state.params.playlistId}/tracks`, { track: track.uri })
      .then(() => {
        getPlaylist();
      });
  }

  vm.addTrack = addTrack;
}
