import { useState } from 'react';
import useUserStore from '../store/useUserStore';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [username, setUsernameInput] = useState('');
  const setUsername = useUserStore((state) => state.setUsername);
  const router = useRouter();

  const handleLogin = () => {
    setUsername(username);
    router.push('/chat');
  };

  return (
    <div>
      <h1>로그인</h1>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsernameInput(e.target.value)} 
        placeholder="사용자 이름" 
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  )  
};

export default LoginPage;
