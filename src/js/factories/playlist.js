angular
  .module('spotifyApp')
  .factory('Playlist', Playlist);

Playlist.$inject = ['$resource'];
function Playlist($resource) {
  return new $resource('/api/playlists/:id', { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
