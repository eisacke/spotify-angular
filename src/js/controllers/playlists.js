angular
  .module('spotifyApp')
  .controller('PlaylistsShowCtrl', PlaylistsShowCtrl);

PlaylistsShowCtrl.$inject = ['User', 'Playlist', 'PlaylistSuggestion', '$state', '$http'];
function PlaylistsShowCtrl(User, Playlist, PlaylistSuggestion, $state, $http) {
  const vm = this;

  User
    .get($state.params)
    .$promise
    .then((user) => {
      vm.user = user;
      getPlaylist();
      getSuggestions();
    });

  function getSuggestions() {
    Playlist
      .get({ id: $state.params.playlistId })
      .$promise
      .then((playlist) => {
        vm.suggestions = playlist.suggestions;
        if(vm.suggestions.length) populateSuggestions();
      });
  }

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
        removeSuggestion(track);
        getPlaylist();
      });
  }

  vm.addTrack = addTrack;

  function removeTrack(item) {
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

  function populateSuggestions() {
    const trackIds = vm.suggestions.map(sugestion => sugestion.spotifyId).join(',');
    $http
      .get('/api/spotify/tracks', { params: { trackIds } })
      .then((response) => {
        console.log(response);
        vm.populatedSuggestions = response.data.tracks;
        for(let i = 0; i < vm.suggestions.length; i++) {
          vm.populatedSuggestions[i].id = vm.suggestions[i].id;
          vm.populatedSuggestions[i].createdBy = vm.suggestions[i].createdBy;
        }
      });
  }

  function addSuggestion(track) {
    PlaylistSuggestion
      .save({ playlistId: vm.playlist.id }, { spotifyId: track.id })
      .$promise
      .then(() => {
        getSuggestions();
      });
  }

  vm.addSuggestion = addSuggestion;

  function removeSuggestion(suggestion) {
    PlaylistSuggestion
      .delete({ playlistId: vm.playlist.id, id: suggestion.id })
      .$promise
      .then(() => {
        getSuggestions();
      });
  }

  vm.removeSuggestion = removeSuggestion;
}
