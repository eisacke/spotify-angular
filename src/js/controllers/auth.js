angular
  .module('spotifyApp')
  .controller('RegisterCtrl', RegisterCtrl)
  .controller('LoginCtrl', LoginCtrl);

RegisterCtrl.$inject = ['$auth', '$state'];
function RegisterCtrl($auth, $state) {
  const vm = this;
  vm.user = {};

  function submit() {
    if (vm.registerForm.$valid) {
      $auth.signup(vm.user)
        .then(() => $state.go('login'))
        .catch(() => $state.go('register'));
    }
  }

  vm.submit = submit;
}

LoginCtrl.$inject = ['$auth', '$state'];
function LoginCtrl($auth, $state) {
  const vm = this;
  vm.credentials = {};
  vm.submit = submit;
  vm.authenticate = authenticate;

  function authenticate(provider) {
    $auth.authenticate(provider)
      .then(() => {
        const { userId } = $auth.getPayload();
        $state.go('usersShow', { id: userId });
      })
      .catch(() => $state.go('login'));
  }

  function submit() {
    if (vm.loginForm.$valid) {
      $auth.login(vm.credentials)
        .then(() => {
          const { userId } = $auth.getPayload();
          $state.go('usersShow', { id: userId });
        })
        .catch(() => $state.go('login'));
    }
  }
}
