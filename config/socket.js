module.exports = function (socket) {

  socket.on('started:typing', function (user) {
    socket.broadcast.emit('started:typing', user);
  });

  socket.on('stopped:typing', function (user) {
    socket.broadcast.emit('stopped:typing', user);
  });

  socket.on('send:message', function (message) {
    socket.broadcast.emit('send:message', message);
  });

  socket.on('delete:message', function (message) {
    socket.broadcast.emit('delete:message', message);
  });

};
