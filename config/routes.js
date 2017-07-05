const router = require('express').Router();
const users = require('../controllers/users');
const auth = require('../controllers/auth');
const oauth = require('../controllers/oauth');
const spotify = require('../controllers/spotify');
const messages = require('../controllers/messages');
const secureRoute = require('../lib/secureRoute');

router.route('/users')
  .get(users.index);

router.route('/users/:id')
  .get(users.show)
  .delete(users.delete);

router.route('/messages')
  .get(messages.index)
  .post(secureRoute, messages.create);

router.route('/messages/:id')
  .delete(messages.delete);

router.route('/register')
  .post(auth.register);

router.route('/login')
  .post(auth.login);

router.route('/oauth/spotify')
  .post(oauth.spotify);

router.route('/users/:id/playlists/:playlistId')
  .get(secureRoute, spotify.getPlaylist);

router.route('/users/:id/playlists')
  .get(secureRoute, spotify.getPlaylists);

router.route('/spotify/search')
  .get(secureRoute, spotify.searchTracks);

router.route('/users/:id/playlists')
  .post(secureRoute, spotify.createPlaylist);

router.route('/users/:id/playlists/:playlistId/tracks')
  .post(secureRoute, spotify.addTrack);

router.all('/*', (req, res) => res.notFound());

module.exports = router;
