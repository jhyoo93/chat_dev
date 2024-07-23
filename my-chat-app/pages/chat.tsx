import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import useStore from '../store/useStore';
import useChatStore from '../store/useChatStore';

const socket = io();

const fetchMessages = async (chatId: string) => {
  const { data } = await axios.get(`/api/messages?chatId=${chatId}`);
  return data;
};

const sendMessageToDB = async (message: { content: string; sender: string; receiver: string }) => {
  console.log("Sending message to DB:", message);  // 디버깅 로그 추가
  await axios.post('/api/messages', message);
};

export default function Chat() {
  const router = useRouter();
  const { username, chatId } = router.query;
  const [inputValue, setInputValue] = useState('');
  const { messages, addMessage, setMessages } = useStore();
  const queryClient = useQueryClient();
  const { chats } = useChatStore();

  useEffect(() => {
    console.log("Username:", username);  // 디버깅 로그 추가
    console.log("ChatId:", chatId);  // 디버깅 로그 추가
    console.log("Chats:", chats);  // 디버깅 로그 추가
  }, [username, chatId, chats]);

  const chat = chats.find((chat) => chat._id === chatId);

  const { data, isLoading } = useQuery(
    ['messages', chatId],
    () => fetchMessages(chatId as string),
    {
      enabled: !!chatId,
      onSuccess: (data) => {
        setMessages(data);
      },
    }
  );

  const mutation = useMutation(sendMessageToDB, {
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', chatId]);
    },
  });

  useEffect(() => {
    if (username && chatId) {
      socket.emit('joinRoom', { sender: username, receiver: chatId });
    }

    socket.on('receiveMessage', (message) => {
      addMessage(message);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [username, chatId]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    if (!chat) {
      console.error('Chat not found');
      return;
    }

    const otherUser = chat.users.find((user) => user.username !== username);
    if (!otherUser) {
      console.error('Other user not found');
      return;
    }

    const message = { content: inputValue, sender: username as string, receiver: otherUser._id };
    console.log("Sending message:", message);  // 디버깅 로그 추가
    socket.emit('sendMessage', message);
    mutation.mutate(message);
    setInputValue('');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Chat with {chat?.users.map((user) => user.username).join(', ')}</h1>
      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        {messages.map((message, index) => (
          <div key={index}>
            <b>{message.sender}:</b> {message.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
}
