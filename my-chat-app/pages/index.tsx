import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useChatStore from '../store/useChatStore';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { chats, setChats } = useChatStore();

  const fetchChats = async (username: string) => {
    if (username.trim()) {
      try {
        const encodedUsername = encodeURIComponent(username);
        console.log(`Fetching chats for user: ${encodedUsername}`); // 디버깅 로그 추가
        const { data } = await axios.get(`/api/chats?userId=${encodedUsername}`);
        console.log('Fetched chats:', data); // 디버깅 로그 추가
        setChats(data);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    }
  };

  useEffect(() => {
    const debounceFetchChats = setTimeout(() => fetchChats(username), 300);

    return () => clearTimeout(debounceFetchChats);
  }, [username, setChats]);

  const handleLogin = async () => {
    console.log('Login button clicked');
    if (username.trim()) {
      try {
        await axios.post('/api/login', { username });
        console.log('Login successful, fetching chats');
        await fetchChats(username); // 여기에 로그인 후 채팅 목록을 불러오는 로직 추가
        if (chats.length > 0) {
          router.push(`/chat?username=${encodeURIComponent(username)}&chatId=${chats[0]._id}`);
        } else {
          console.error('No chats available');
        }
      } catch (error) {
        console.error('Failed to login:', error);
      }
    } else {
      console.error('Username is empty');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />
      <button onClick={handleLogin}>Login</button>
      <h2>Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id}>
            <button onClick={() => router.push(`/chat?username=${encodeURIComponent(username)}&chatId=${chat._id}`)}>
              {chat.users.map((user) => user.username).join(', ')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
