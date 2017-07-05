module.exports = function (socket) {

  // broadcast a user's message to other users
  socket.on('started:typing', function (user) {
    socket.broadcast.emit('started:typing', user);
  });

  socket.on('stopped:typing', function (user) {
    socket.broadcast.emit('stopped:typing', user);
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (message) {
    socket.broadcast.emit('send:message', message);
  });

  socket.on('delete:message', function (message) {
    socket.broadcast.emit('delete:message', message);
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left');
  });

};
