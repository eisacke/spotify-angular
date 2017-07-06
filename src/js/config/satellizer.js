angular
  .module('spotifyApp')
  .config(Auth);

Auth.$inject = ['$authProvider'];
function Auth($authProvider) {
  $authProvider.signupUrl = '/api/register';
  $authProvider.loginUrl = '/api/login';

  $authProvider.spotify({
    url: '/api/oauth/spotify',
    clientId: '9db6be6b16404adba1a8a040f5bc10e7',
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    redirectUri: 'http://localhost:4000',
    optionalUrlParams: ['state'],
    requiredUrlParams: ['scope'],
    scope: ['user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-modify-playback-state'],
    scopePrefix: '',
    scopeDelimiter: ',',
    oauthType: '2.0',
    popupOptions: { width: 500, height: 530 }
  });
}
