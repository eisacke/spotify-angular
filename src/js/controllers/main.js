angular
  .module('spotifyApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', '$state', '$auth', '$transitions', 'User', '$http'];
function MainCtrl($rootScope, $state, $auth, $transitions, User, $http) {
  const vm = this;
  vm.navIsOpen = false;

  vm.isAuthenticated = $auth.isAuthenticated;

  $rootScope.$on('error', (e, err) => {
    vm.message = err.data.message;
    if(err.status === 401) {
      if(vm.pageName !== 'login') vm.stateHasChanged = false;
      $state.go('login');
    }
  });

  $transitions.onSuccess({}, (transition) => {
    vm.navIsOpen = false; // Making the burger menu closed by default on page load
    vm.pageName = transition.$to().name; // Storing the current state name as a string
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
    if($auth.getPayload()) {
      vm.currentUserId = $auth.getPayload().userId;
      vm.currentUser = User.get({ id: vm.currentUserId });
    }
  });

  function logout() {
    $auth.logout();
    $state.go('login');
  }

  vm.logout = logout;

  function pause() {
    $http
      .put('/api/spotify/pause');
  }

  vm.pause = pause;

  function resume() {
    $http
      .put('/api/spotify/resume');
  }

  vm.resume = resume;
}
