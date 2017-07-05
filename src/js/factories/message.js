angular
  .module('spotifyApp')
  .factory('Message', Message);

Message.$inject = ['$resource'];
function Message($resource) {
  return new $resource('/api/messages/:id', { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
