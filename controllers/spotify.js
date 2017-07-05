const rp = require('request-promise');
const config = require('../config/oauth');

function createPlaylist(req, res, next) {
  return rp({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: config.spotify.refreshToken,
      client_id: config.spotify.clientId,
      client_secret: config.spotify.clientSecret
    },
    json: true
  }).then((token) => {
    config.spotify.accessToken = token.access_token;
    return rp({
      method: 'POST',
      url: `https://api.spotify.com/v1/users/${req.user.spotifyId}/playlists`,
      body: {
        name: req.body.name
      },
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json'
      },
      json: true
    });
  }).then((response) => {
    res.json(response);
  })
  .catch(next);
}

function getPlaylists(req, res, next) {
  return rp({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: config.spotify.refreshToken,
      client_id: config.spotify.clientId,
      client_secret: config.spotify.clientSecret
    },
    json: true
  }).then((token) => {
    config.spotify.accessToken = token.access_token;
    return rp({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        'Authorization': `Bearer ${config.spotify.accessToken}`
      },
      json: true
    });
  }).then((response) => {
    res.json(response);
  })
  .catch(next);
}

function getPlaylist(req, res, next) {
  return rp({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: config.spotify.refreshToken,
      client_id: config.spotify.clientId,
      client_secret: config.spotify.clientSecret
    },
    json: true
  }).then((token) => {
    config.spotify.accessToken = token.access_token;
    return rp({
      method: 'GET',
      url: `https://api.spotify.com/v1/users/${req.params.id}/playlists/${req.params.playlistId}`,
      headers: {
        'Authorization': `Bearer ${config.spotify.accessToken}`
      },
      json: true
    });
  }).then((response) => {
    res.json(response);
  })
  .catch(next);
}

function addTrack(req, res, next) {
  return rp({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: config.spotify.refreshToken,
      client_id: config.spotify.clientId,
      client_secret: config.spotify.clientSecret
    },
    json: true
  }).then((token) => {
    config.spotify.accessToken = token.access_token;
    return rp({
      method: 'POST',
      url: `https://api.spotify.com/v1/users/${req.user.spotifyId}/playlists/${req.params.id}/tracks`,
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json'
      },
      body: {
        uris: [req.params.trackId]
      },
      json: true
    });
  }).then((response) => {
    res.json(response);
  })
  .catch(next);
}

function searchTracks(req, res, next) {
  return rp({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: config.spotify.refreshToken,
      client_id: config.spotify.clientId,
      client_secret: config.spotify.clientSecret
    },
    json: true
  }).then((token) => {
    config.spotify.accessToken = token.access_token;
    return rp({
      method: 'GET',
      url: 'https://api.spotify.com/v1/search',
      headers: {
        'Authorization': `Bearer ${token.access_token}`
      },
      qs: {
        q: req.query.q,
        type: 'track',
        limit: 10
      },
      json: true
    });
  }).then((response) => {
    res.json(response);
  })
  .catch(next);
}

module.exports = {
  createPlaylist,
  getPlaylists,
  getPlaylist,
  addTrack,
  searchTracks
};
