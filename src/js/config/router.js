angular
  .module('spotifyApp')
  .config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'js/views/statics/home.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'js/views/auth/login.html',
      controller: 'LoginCtrl as login'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'js/views/auth/register.html',
      controller: 'RegisterCtrl as register'
    })
    .state('usersIndex', {
      url: '/users',
      templateUrl: 'js/views/users/index.html',
      controller: 'UsersIndexCtrl as usersIndex'
    })
    .state('usersShow', {
      url: '/users/:id',
      templateUrl: 'js/views/users/show.html',
      controller: 'UsersShowCtrl as usersShow'
    })
    .state('playlistsShow', {
      url: '/users/:id/playlists/:playlistId',
      templateUrl: 'js/views/playlists/show.html',
      controller: 'PlaylistsShowCtrl as playlistsShow'
    })
    .state('messagesIndex', {
      url: '/messages',
      templateUrl: 'js/views/messages/index.html',
      controller: 'MessagesIndexCtrl as messagesIndex'
    });

  $urlRouterProvider.otherwise('/');
}
