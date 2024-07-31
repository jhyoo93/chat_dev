import { useState, useEffect } from 'react'
import './App.css'
import { io } from 'socket.io-client';

function App() {
  const [username, setUsername] = useState(''); 
  const [userInput, setUserInput] = useState(''); 
  const [messages, setMessages] = useState([]);

  const [isConnected, setIsConnected] = useState(false); 
  const [socket, setSocket] = useState(null);

  // 소켓 연결
  const connectToChatServer = () => {
    console.log('connectToChatServer');
    const _socket = io('http://localhost:3000', {
      autoConnect: false,
      query: {
        username: username,
      }
    });
    _socket.connect();
    setSocket(_socket);
  } 

  // 접속 이벤트
  const onConnected = () => {
    console.log('클라이언트 - onConnected');
    setIsConnected(true);
  };

  // 종료 이벤트
  const onDisConnected = () => {
    console.log('클라이언트 - onDisConnected');
    setIsConnected(false);
  };

  const onMessageReceived = (msg) => {
    console.log('클라이언트 - onMessageReceived');
    console.log(msg);

    setMessages(previous => [...previous, msg]);
  }

  // 소켓 종료
  const disconnectToChatServer = () => {
    console.log('disconnectToChatServer');
    socket?.disconnect();
  }

  // 메세지 전송
  const sendMessageToChatServer = (e) => {
    e.preventDefault();
    console.log(`message sand! input: ${userInput}`);
    socket?.emit('new message', { username: username, message: userInput }, (response) => {
      console.log(response);
    });

    setUserInput('');
  };

  // 메세지 리스트가 변경될때 스크롤 커스텀
  useEffect(() => {
    console.log('useEffect 스크롤 올리기');
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }, [messages]);

  // 소켓 서버 접속 종료 될때
  useEffect(() => {
    console.log('useEffect called!');
    socket?.on('connect', onConnected);
    socket?.on('disconnect', onDisConnected);

    socket?.on('new message', onMessageReceived);

    return () => {
      // 클린 함수 접속을 종료했을때 함수 제거
      console.log('useEffect clean up fundtion!');
      socket?.off('connect', onConnected);
      socket?.off('disconnect', onDisConnected);
      socket?.off('message', onMessageReceived);
    }

  }, [socket]);

  // 메세지 리스트 element
  const messageList = messages.map((aMsg, index) => 
    <li key={index}>
      {aMsg.username} : {aMsg.message}
    </li>
  );

  return (
    <>
      <div className='Navbar'>
        <h1>Talk</h1>
        <h2>{isConnected ? username + "님 접속중" : ""}</h2>  
        <div className='Card'>
          <input value={username} onChange={e => setUsername(e.target.value)} />
          <button onClick={() => connectToChatServer()}>
            접속
          </button>
          <button onClick={() => disconnectToChatServer()}>
            접속종료
          </button>
        </div>
      </div>    

      <ul className='ChatList'>
        {messageList}
      </ul>

      <form className='MessageInput' onSubmit={e => sendMessageToChatServer(e)}>
        <input value={userInput} onChange={e => setUserInput(e.target.value)} />
        <button type="submit">
          보내기
        </button>
      </form>

    </>
  )
}

export default App
