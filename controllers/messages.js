const Message = require('../models/message');

function indexRoute(req, res, next) {
  Message
    .find()
    .populate('sentBy')
    .exec()
    .then((messages) => res.json(messages))
    .catch(next);
}

function createRoute(req, res, next) {
  req.body.sentBy = req.user;

  Message
    .create(req.body)
    .then((message) => res.json(message))
    .catch(next);
}

function deleteRoute(req, res, next) {
  Message
    .findById(req.params.id)
    .exec()
    .then(message => {
      if(!message) return res.notFound();
      return message.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: indexRoute,
  create: createRoute,
  delete: deleteRoute
};
