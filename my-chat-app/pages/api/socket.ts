import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket } from 'net';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: HTTPServer & {
      io?: SocketIOServer;
    };
  };
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket?.server.io) {
    console.log('Setting up Socket.IO server...');
    const httpServer: HTTPServer & { io?: SocketIOServer } = res.socket.server;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket.io',
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A new client connected');

      socket.on('join', (room) => {
        socket.join(room);
        console.log(`Client joined room ${room}`);
      });

      socket.on('message', (msg) => {
        console.log(`Received message: ${msg.message} from ${msg.username} in room ${msg.room}`);
        io.to(msg.room).emit('message', msg);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  } else {
    console.log('Socket.IO server already set up');
  }
  res.end();
};

export default ioHandler;
