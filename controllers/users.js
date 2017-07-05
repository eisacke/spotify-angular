const User = require('../models/user');

function indexRoute(req, res, next) {
  User
    .find()
    .populate('createdBy')
    .exec()
    .then((users) => res.json(users))
    .catch(next);
}

function showRoute(req, res, next) {
  User
    .findById(req.params.id)
    .populate('createdBy comments.createdBy')
    .exec()
    .then((user) => {
      if(!user) return res.notFound();

      res.json(user);
    })
    .catch(next);
}

function deleteRoute(req, res, next) {
  User
    .findById(req.params.id)
    .exec()
    .then((user) => {
      if(!user) return res.notFound();

      return user.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: indexRoute,
  show: showRoute,
  delete: deleteRoute
};
