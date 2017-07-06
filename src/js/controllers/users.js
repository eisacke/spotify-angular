angular
  .module('spotifyApp')
  .controller('UsersIndexCtrl', UsersIndexCtrl)
  .controller('UsersShowCtrl', UsersShowCtrl);

UsersIndexCtrl.$inject = ['User'];
function UsersIndexCtrl(User) {
  const vm = this;

  vm.all = User.query();
}

UsersShowCtrl.$inject = ['User', 'Playlist', '$state', '$http'];
function UsersShowCtrl(User, Playlist, $state, $http) {
  const vm = this;
  User.get($state.params)
    .$promise
    .then((user) => {
      vm.user = user;
      if(vm.user.spotifyId) getPlaylists();
    });

  function usersDelete() {
    vm.user
      .$remove()
      .then(() => $state.go('login'));
  }

  vm.usersDelete = usersDelete;

  function createPlaylist() {
    $http
      .post(`/api/users/${vm.user.id}/playlists`, { name: vm.playlist.name })
      .then(() => {
        getPlaylists();
        vm.playlist = {};
        vm.formVisible = false;
      });
  }

  function getPlaylists() {
    $http
      .get(`/api/users/${vm.user.id}/playlists`, { params: { spotifyId: vm.user.spotifyId }})
      .then((response) => {
        const spotifyPlaylists = response.data.items;
        filterPlaylists(spotifyPlaylists);
      });
  }

  function filterPlaylists(spotifyPlaylists) {
    Playlist
      .query({ createdBy: vm.user.id })
      .$promise
      .then((playlists) => {
        vm.playlists = spotifyPlaylists.filter((playlist) => {
          return playlists.find(userPlaylist =>  userPlaylist.spotifyId === playlist.id);
        });
      });
  }

  vm.createPlaylist = createPlaylist;
}
