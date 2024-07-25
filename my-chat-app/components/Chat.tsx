import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import useChatStore from '../stores/chatStore';
import { signOut } from 'next-auth/react';

const fetchMessages = async () => {
  const res = await fetch('/api/messages');
  return res.json();
};

const sendMessage = async (message) => {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  return res.json();
};

const Chat = () => {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const addMessage = useChatStore((state) => state.addMessage);
  const messages = useChatStore((state) => state.messages);

  const { data: initialMessages } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    onSuccess: (data) => {
      data.forEach((msg) => addMessage(msg));
    },
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
  });

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('message', (msg) => {
      addMessage(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [addMessage]);

  const handleSendMessage = () => {
    const newMessage = { user: 'User', text: message }; // 실제 사용자 정보를 사용해야 합니다.
    socket.emit('message', newMessage);
    mutation.mutate(newMessage);
    setMessage('');
  };

  return (
    <div>
      <div>
        <button onClick={() => signOut()} style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}>
          Log Out
        </button>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}: </strong>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
