angular
  .module('spotifyApp')
  .controller('PlaylistsShowCtrl', PlaylistsShowCtrl);

PlaylistsShowCtrl.$inject = ['User', 'Playlist', 'PlaylistSuggestion', '$state', '$http', 'socket', '$auth', '$scope'];
function PlaylistsShowCtrl(User, Playlist, PlaylistSuggestion, $state, $http, socket, $auth, $scope) {
  const vm = this;
  let currentSongTimeout = null;
  let currentSongInterval = null;

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

        findMostUpvotes();
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
        socket.emit('voted:suggestion');
      });
  }

  vm.upvoteSuggestion = upvoteSuggestion;

  function playPlaylist() {
    $http
      .put('/api/spotify/playlist', { playlist: vm.playlist.uri })
      .then(() => {
        startTimer(0);
      });
  }

  function msToTime(duration) {
    let seconds = parseInt((duration/1000)%60);
    let minutes = parseInt((duration/(1000*60))%60);
    let hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
  }

  function findMostUpvotes() {
    return vm.populatedSuggestions.reduce((acc, suggestion) => {
      return acc.upvotes.length > suggestion.upvotes.length ? acc : suggestion;
    });
  }

  function startCountdownTimer(seconds) {
    vm.countdownMessage = `Adding next song in ${seconds} seconds`;

    const intervalId = setInterval(() => {
      seconds--;
      vm.countdownMessage = `Adding next song in ${seconds} seconds`;
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      vm.countdownMessage = null;
      const trackToAdd = findMostUpvotes();
      if(trackToAdd) addTrack(trackToAdd);
    }, seconds*1000);
  }

  function startTimer(index) {
    if(currentSongTimeout) clearTimeout(currentSongTimeout);
    if(currentSongInterval) clearInterval(currentSongInterval);
    vm.currentSong = vm.playlist.tracks.items[index];
    socket.emit('currently:playing', vm.currentSong);
    let milliseconds = vm.currentSong.track.duration_ms;

    currentSongInterval = setInterval(() => {
      milliseconds = milliseconds - 1000;
      const time = msToTime(milliseconds);
      console.log(time);
      $scope.$apply();
      if(isLastSong() && Math.floor(milliseconds/1000) === 30) {
        startCountdownTimer(10);
      }
    }, 1000);

    currentSongTimeout = setTimeout(() => {
      clearInterval(currentSongInterval);
      index++;
      if(index < vm.playlist.tracks.items.length) {
        startTimer(index);
      } else {
        vm.currentSong = null;
        $scope.$apply();
      }
    }, vm.currentSong.track.duration_ms);
  }

  function isLastSong(index) {
    return index === vm.playlist.tracks.items.length - 1;
  }

  vm.playPlaylist = playPlaylist;

  function playPlaylistTrack(index) {
    $http
      .put('/api/spotify/playlist/track', { playlist: vm.playlist.uri, position: index })
      .then(() => {
        startTimer(index);
      });
  }

  vm.playPlaylistTrack = playPlaylistTrack;

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

  socket.on('voted:suggestion', function() {
    getSuggestions();
  });

  socket.on('currently:playing', function(currentSong) {
    vm.currentSong = currentSong;
  });
}
