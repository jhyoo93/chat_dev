import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (room: string): Socket => {
  const socket = io({
    path: '/api/socket.io',
  });

  useEffect(() => {
    console.log(`Attempting to connect to room: ${room}`);
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('join', room);
    });

    socket.on('message', (msg) => {
      console.log(`Received message: ${msg.message} from ${msg.username} in room ${msg.room}`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.emit('leave', room);
      socket.disconnect();
    };
  }, [room]);

  return socket;
};

export default useSocket;
