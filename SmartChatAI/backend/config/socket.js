const socketIO = require('socket.io');

const configureSocket = (server, corsOrigin) => {
  const io = socketIO(server, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = configureSocket;
