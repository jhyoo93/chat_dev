import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      console.log('New client connected');

      socket.on('message', (msg) => {
        io.emit('message', msg); // 메시지를 모든 클라이언트에게 브로드캐스트
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.io server already running');
  }

  res.end();
};

export default ioHandler;
