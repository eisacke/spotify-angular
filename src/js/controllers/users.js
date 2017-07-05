angular
  .module('spotifyApp')
  .controller('UsersIndexCtrl', UsersIndexCtrl)
  .controller('UsersShowCtrl', UsersShowCtrl);

UsersIndexCtrl.$inject = ['User'];
function UsersIndexCtrl(User) {
  const vm = this;

  vm.all = User.query();
}

UsersShowCtrl.$inject = ['User', '$state', '$http'];
function UsersShowCtrl(User, $state, $http) {
  const vm = this;
  vm.user = User.get($state.params);

  function usersDelete() {
    vm.user
      .$remove()
      .then(() => $state.go('login'));
  }

  vm.usersDelete = usersDelete;

  function createPlaylist() {
    $http
      .post('/api/spotify/playlists', { name: vm.playlist.name })
      .then((response) => {
        vm.playlists.push(response.data);
        vm.playlist = {};
        vm.formVisible = false;
      });
  }

  function getPlaylists() {
    $http
      .get('/api/spotify/playlists')
      .then((response) => {
        vm.playlists = response.data.items;
      });
  }

  getPlaylists();

  vm.createPlaylist = createPlaylist;
}
