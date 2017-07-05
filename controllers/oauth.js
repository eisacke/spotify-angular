const rp = require('request-promise');
const config = require('../config/oauth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/environment');

function spotify(req, res, next) {
  return rp({
    method: 'POST',
    url: config.spotify.accessTokenURL,
    form: {
      redirect_uri: config.spotify.redirectUri,
      grant_type: 'authorization_code',
      code: req.body.code,
      client_id: config.spotify.clientId,
      client_secret: config.spotify.clientSecret
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  }).then((token) => {
    config.spotify.refreshToken = token.refresh_token;
    config.spotify.accessToken = token.access_token;

    return rp({
      method: 'GET',
      url: config.spotify.profileURL,
      json: true,
      headers: {
        'Authorization': `Bearer ${token.access_token}`
      }
    });
  })
  .then((profile) => {
    return User
      .findOne({ $or: [{ email: profile.email }, { spotifyId: profile.id }] })
      .then((user) => {
        if(!user) {
          user = new User({
            username: profile.display_name,
            email: profile.email,
            image: profile.images[0].url
          });
        }

        user.spotifyId = profile.id;
        return user.save();
      });
  })
  .then((user) => {
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1hr' });
    return res.json({ token, message: `Welcome back ${user.username}` });
  })
  .catch(next);
}

module.exports = {
  spotify
};
