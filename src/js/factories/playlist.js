angular
  .module('spotifyApp')
  .factory('Playlist', Playlist)
  .factory('PlaylistSuggestion', PlaylistSuggestion);

Playlist.$inject = ['$resource'];
function Playlist($resource) {
  return new $resource('/api/playlists/:id', { id: '@id' }, {
    update: { method: 'PUT' }
  });
}

PlaylistSuggestion.$inject = ['$resource'];
function PlaylistSuggestion($resource) {
  return new $resource('/api/playlists/:playlistId/suggestions/:id', { id: '@id' }, {
    update: { method: 'PUT', params: { id: '@id', playlistId: '@playlistId' } }
  });
}
