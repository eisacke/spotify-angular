const Playlist = require('../models/playlist');

function indexRoute(req, res, next) {
  Playlist
    .find()
    .exec()
    .then((playlists) => res.json(playlists))
    .catch(next);
}

function createRoute(req, res, next) {
  Playlist
    .create(req.body)
    .then((playlist) => res.status(201).json(playlist))
    .catch(next);
}

function showRoute(req, res, next) {
  Playlist
    .findById(req.params.id)
    .exec()
    .then((playlist) => {
      if(!playlist) return res.notFound();

      res.json(playlist);
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Playlist
    .findById(req.params.id)
    .exec()
    .then((playlist) => {
      if(!playlist) return res.notFound();

      for(const field in req.body) {
        playlist[field] = req.body[field];
      }

      return playlist.save();
    })
    .then((playlist) => res.json(playlist))
    .catch(next);
}

function deleteRoute(req, res, next) {
  Playlist
    .findOne({ spotifyId: req.params.id })
    .exec()
    .then((playlist) => {
      if(!playlist) return res.notFound();
      console.log(playlist);

      return playlist.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

function addSuggestionRoute(req, res, next) {

  req.body.createdBy = req.user;

  Playlist
    .findById(req.params.id)
    .exec()
    .then((playlist) => {
      if(!playlist) return res.notFound();

      const suggestion = playlist.suggestions.create(req.body);
      playlist.suggestions.push(suggestion);

      return playlist.save()
        .then(() => res.json(suggestion));
    })
    .catch(next);
}

function deleteSuggestionRoute(req, res, next) {
  Playlist
    .findById(req.params.id)
    .exec()
    .then((playlist) => {
      if(!playlist) return res.notFound();

      const suggestion = playlist.suggestions.id(req.params.suggestionId);
      suggestion.remove();

      return playlist.save();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  update: updateRoute,
  delete: deleteRoute,
  addSuggestion: addSuggestionRoute,
  deleteSuggestion: deleteSuggestionRoute
};
