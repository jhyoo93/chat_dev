import { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';
import useUserStore from '../store/useUserStore';
import { useRouter } from 'next/router';

type Message = {
  room: string;
  username: string;
  message: string;
};

const ChatPage = () => {
  const username = useUserStore((state) => state.username);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const room = 'random-chat-room'; // 모든 사용자가 참여할 방 이름
  const socket = useSocket(room);

  useEffect(() => {
    if (!username) {
      router.push('/');
    } else {
      console.log(`Username: ${username}, joining room: ${room}`);
      socket.on('message', (msg: Message) => {
        console.log(`Message received: ${msg.message} from ${msg.username} in room ${msg.room}`);
        setMessages((prev) => [...prev, msg]);
      });

      return () => {
        socket.off('message');
      };
    }
  }, [username, socket, router]);

  const sendMessage = () => {
    const msg: Message = { room, username, message };
    console.log(`Sending message: ${message}`);
    socket.emit('message', msg);
    setMessage('');
  };

  return (
    <div>
      <h1>채팅</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}: </strong> {msg.message}
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="메시지 입력" 
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatPage;
