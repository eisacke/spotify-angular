angular
  .module('spotifyApp')
  .controller('MessagesIndexCtrl', MessagesIndexCtrl);

MessagesIndexCtrl.$inject = ['$scope', 'socket', 'Message', '$auth', 'User'];
function MessagesIndexCtrl($scope, socket, Message, $auth, User) {
  const vm = this;
  if($auth.getPayload()) vm.currentUserId = $auth.getPayload().userId;
  if(vm.currentUserId) vm.currentUser = User.get({ id: vm.currentUserId });

  vm.typing = [];

  socket.on('send:message', function (message) {
    vm.messages.push(message);
  });

  socket.on('started:typing', function (user) {
    const index = vm.typing.indexOf(user.username);
    if(index === -1) vm.typing.push(user.username);
  });

  socket.on('stopped:typing', function (user) {
    const index = vm.typing.indexOf(user.username);
    vm.typing.splice(index, 1);
  });

  socket.on('delete:message', function (messageToDelete) {
    const index = vm.messages.findIndex((message) => message.id === messageToDelete.id);
    vm.messages.splice(index, 1);
  });

  socket.on('user:left', function () {
    vm.typing = [];
  });

  vm.messages = Message.query();
  vm.sendMessage = sendMessage;
  vm.deleteMessage = deleteMessage;

  function isTyping() {
    if(vm.message.content.length > 0) {
      socket.emit('started:typing', vm.currentUser);
    } else {
      socket.emit('stopped:typing', vm.currentUser);
    }
  }

  vm.isTyping = isTyping;

  function deleteMessage(messageToDelete) {
    Message
      .delete({ id: messageToDelete.id })
      .$promise
      .then(() => {
        socket.emit('delete:message', messageToDelete);
        const index = vm.messages.findIndex((message) => message.id === messageToDelete.id);
        vm.messages.splice(index, 1);
      });
  }

  function sendMessage() {
    Message
      .save(vm.message)
      .$promise
      .then((message) => {
        socket.emit('send:message', message);
        socket.emit('stopped:typing', vm.currentUser);
        vm.messages.push(message);
        vm.message = {};
      });
  }
}
