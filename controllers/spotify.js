const rp = require('request-promise');
const config = require('../config/oauth');
const Playlist = require('../models/playlist');

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
    const playlist = { spotifyId: response.id, createdBy: req.user };
    return Playlist.create(playlist);
  }).then((playlist) => {
    res.json(playlist);
  })
  .catch(next);
}

function getPlaylists(req, res, next) {
  return rp({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'client_credentials',
      client_id: config.spotify.clientId,
      client_secret: config.spotify.clientSecret
    },
    json: true
  }).then((token) => {
    config.spotify.accessToken = token.access_token;
    return rp({
      method: 'GET',
      url: `https://api.spotify.com/v1/users/${req.query.spotifyId}/playlists`,
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
      grant_type: 'client_credentials',
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

function getTracks(req, res, next) {
  return rp({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'client_credentials',
      client_id: config.spotify.clientId,
      client_secret: config.spotify.clientSecret
    },
    json: true
  }).then((token) => {
    config.spotify.accessToken = token.access_token;
    return rp({
      method: 'GET',
      url: 'https://api.spotify.com/v1/tracks',
      qs: {
        ids: req.query.trackIds
      },
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
      url: `https://api.spotify.com/v1/users/${req.params.id}/playlists/${req.params.playlistId}/tracks`,
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json'
      },
      body: {
        uris: [req.body.track]
      },
      json: true
    });
  }).then((response) => {
    res.json(response);
  })
  .catch(next);
}

function removeTrack(req, res, next) {
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
      method: 'DELETE',
      url: `https://api.spotify.com/v1/users/${req.params.id}/playlists/${req.params.playlistId}/tracks`,
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json'
      },
      body: {
        uris: [req.body.track]
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
      grant_type: 'client_credentials',
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

function playPlaylist(req, res, next) {
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
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json'
      },
      body: {
        context_uri: req.body.playlist
      },
      json: true
    });
  }).then((response) => {
    res.json(response);
  })
  .catch(next);
}

function playPlaylistTrack(req, res, next) {
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
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json'
      },
      body: {
        context_uri: req.body.playlist,
        offset: { position: req.body.position }
      },
      json: true
    });
  }).then((response) => {
    res.json(response);
  })
  .catch(next);
}

function pause(req, res, next) {
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
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: {
        'Authorization': `Bearer ${token.access_token}`
      },
      json: true
    });
  }).then((response) => {
    res.json(response);
  })
  .catch(next);
}

function resume(req, res, next) {
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
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: {
        'Authorization': `Bearer ${token.access_token}`
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
  getTracks,
  searchTracks,
  removeTrack,
  playPlaylist,
  playPlaylistTrack,
  pause,
  resume
};
