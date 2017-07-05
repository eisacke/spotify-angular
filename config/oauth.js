module.exports = {
  spotify: {
    loginURL: 'https://accounts.spotify.com/authorize',
    accessTokenURL: 'https://accounts.spotify.com/api/token',
    accessToken: '',
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    profileURL: 'https://api.spotify.com/v1/me',
    redirectUri: 'http://localhost:4000'
  }
};
