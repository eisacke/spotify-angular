angular
  .module('spotifyApp')
  .controller('PlaylistsShowCtrl', PlaylistsShowCtrl);

PlaylistsShowCtrl.$inject = ['User', 'Playlist', 'PlaylistSuggestion', '$state', '$http', 'socket', '$auth'];
function PlaylistsShowCtrl(User, Playlist, PlaylistSuggestion, $state, $http, socket, $auth) {
  const vm = this;

  if($auth.getPayload()) vm.currentUserId = $auth.getPayload().userId;

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
        socket.emit('added:track');
      });
  }

  vm.addTrack = addTrack;

  function removeTrack(item) {
    $http
      .put(`/api/users/${vm.user.spotifyId}/playlists/${$state.params.playlistId}/tracks`, { track: item.track.uri })
      .then(() => {
        getPlaylist();
        socket.emit('removed:track');
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
        vm.populatedSuggestions = response.data.tracks;
        for(let i = 0; i < vm.suggestions.length; i++) {
          vm.populatedSuggestions[i].id = vm.suggestions[i].id;
          vm.populatedSuggestions[i].upvotes = vm.suggestions[i].upvotes;
          vm.populatedSuggestions[i].createdBy = vm.suggestions[i].createdBy;
        }
      });
  }

  function addSuggestion(track) {
    PlaylistSuggestion
      .save({ playlistId: vm.playlist.id }, { spotifyId: track.id })
      .$promise
      .then(() => {
        vm.q = '';
        vm.results = [];
        getSuggestions();
        socket.emit('added:suggestion');
      });
  }

  vm.addSuggestion = addSuggestion;

  function hasUpvoted(suggestion) {
    return suggestion.upvotes.includes(vm.currentUserId);
  }

  vm.hasUpvoted = hasUpvoted;

  function removeSuggestion(suggestion) {
    PlaylistSuggestion
      .delete({ playlistId: vm.playlist.id, id: suggestion.id })
      .$promise
      .then(() => {
        getSuggestions();
        socket.emit('removed:suggestion');
      });
  }

  vm.removeSuggestion = removeSuggestion;

  function upvoteSuggestion(suggestion) {
    PlaylistSuggestion
      .update({ playlistId: vm.playlist.id, id: suggestion.id })
      .$promise
      .then(() => {
        const index = suggestion.upvotes.indexOf(vm.currentUserId);
        if (index > -1) {
          suggestion.upvotes.splice(index, 1);
        } else {
          suggestion.upvotes.push(vm.currentUserId);
        }
        socket.emit('voted:suggestion', suggestion);
      });
  }

  vm.upvoteSuggestion = upvoteSuggestion;

  // SOCKETS
  socket.on('added:suggestion', function () {
    getSuggestions();
  });

  socket.on('removed:suggestion', function () {
    getSuggestions();
  });

  socket.on('added:track', function () {
    getPlaylist();
  });

  socket.on('removed:track', function () {
    getPlaylist();
  });

  socket.on('voted:suggestion', function(suggestion) {
    getSuggestions();
  });
}
