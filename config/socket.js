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

  socket.on('added:suggestion', function () {
    socket.broadcast.emit('added:suggestion');
  });

  socket.on('added:track', function () {
    socket.broadcast.emit('added:track');
  });

  socket.on('removed:suggestion', function () {
    socket.broadcast.emit('removed:suggestion');
  });

  socket.on('removed:track', function () {
    socket.broadcast.emit('removed:track');
  });

  socket.on('voted:suggestion', function () {
    socket.broadcast.emit('voted:suggestion');
  });

  socket.on('currently:playing', function (currentSong) {
    socket.broadcast.emit('currently:playing', currentSong);
  });

};
