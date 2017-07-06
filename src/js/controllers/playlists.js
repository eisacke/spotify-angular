angular
  .module('spotifyApp')
  .controller('PlaylistsShowCtrl', PlaylistsShowCtrl);

PlaylistsShowCtrl.$inject = ['User', 'Playlist', '$state', '$http'];
function PlaylistsShowCtrl(User, Playlist, $state, $http) {
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

  function removeTrack(item) {
    console.log(item.track.uri);
    $http
      .put(`/api/users/${vm.user.spotifyId}/playlists/${$state.params.playlistId}/tracks`, { track: item.track.uri })
      .then(() => {
        getPlaylist();
      });
  }

  vm.removeTrack = removeTrack;

  function deletePlaylist() {
    Playlist
      .delete({ id: vm.playlist.id })
      .$promise
      .then(() => {
        console.log('here');
      });
  }

  vm.deletePlaylist = deletePlaylist;
}
