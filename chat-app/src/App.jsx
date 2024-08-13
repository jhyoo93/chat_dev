import { useState } from 'react'
import './App.css'
import ChatRoom from '../components/ChatRoom'; // ChatRoom 컴포넌트 import

function App() {
  const [username, setUsername] = useState(''); 
  const [isConnected, setIsConnected] = useState(false);

  // 채팅 서버에 접속 시도 시 연결 상태를 업데이트
  const connectToChatServer = () => {
    setIsConnected(true);
  };

  // 채팅 서버 접속 종료 시 연결 상태를 업데이트
  const disconnectToChatServer = () => {
    confirm('채팅방을 나가시겠습니까?');
    setIsConnected(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      connectToChatServer();
    }
  };

  return (
    <>
      {!isConnected ? (
        <div className='Main'>
          <h1>랜덤 채팅 🐤</h1>
          <div className='Card'>
            <input 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              onKeyDown={handleKeyDown}
              placeholder="이름을 입력해주세요!"
            />
            <button onClick={() => connectToChatServer()}>
              접속
            </button>
          </div>
        </div>
      ) : (
        <ChatRoom 
          username={username} 
          onDisconnect={disconnectToChatServer} 
        />
      )}
    </>
  )
}

export default App;
