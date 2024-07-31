import { Server } from 'socket.io';
import express from 'express';
import * as http from 'http';
import ViteExpress from 'vite-express';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (client) => {
  console.log(client.handshake.query);

  const connentedClientUsername = client.handshake.query.username;

  // broadcast: 모든 이벤트를 클라이언트로 보냄
  client.broadcast.emit('new message', { 
    username: '관리자', 
    message: `${connentedClientUsername}님이 채팅방에 접속했습니다!` 
  })

  client.on('new message', (msg) => {
    console.log(`보낸 사용자: ${connentedClientUsername}`);
    console.log(msg);
    io.emit('new message', { 
      username: msg.username, 
      message: msg.message 
    })
  });

  client.on('disconnect', () => {
    console.log(`${connentedClientUsername}님이 접속을 종료했습니다..`);
    io.emit('new message', { 
      username: '관리자', 
      message: `${connentedClientUsername}님이 접속을 종료했습니다..` 
    })
  });
});


server.listen(3000, () => {
  console.log('server 3000 port');
});

app.get('/message', (_, res) => { 
  res.send('Hello from express!!')
});

app.get('/api', (_, res) => {
  res.send('Hello from api!!')
});

ViteExpress.bind(app, server);
