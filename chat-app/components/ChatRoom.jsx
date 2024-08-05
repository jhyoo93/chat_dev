import { useState, useEffect } from 'react'
import { io } from 'socket.io-client';
import '../style/chatRoom.css';

function ChatRoom({ username, onDisconnect }) {
  const [userInput, setUserInput] = useState(''); 
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  // 소켓 연결
  useEffect(() => {
    const _socket = io('http://localhost:3000', {
      query: { username },
    });

    setSocket(_socket);

    // 이벤트 핸들러 등록
    _socket.on('connect', () => {
      console.log('Connected to server');
    });

    _socket.on('disconnect', () => {
      console.log('Disconnected from server');
      onDisconnect();
    });

    _socket.on('new message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      _socket.disconnect();
    };
  }, [username, onDisconnect]);

  // 메세지 전송
  const sendMessageToChatServer = (e) => {
    e.preventDefault();
    socket?.emit('new message', { username, message: userInput }, (response) => {
      console.log(response);
    });

    setUserInput('');
  };

  // 메세지 리스트가 변경될때 스크롤 커스텀
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }, [messages]);

  // 메세지 리스트 element
  const messageList = messages.map((aMsg, index) => 
    <li key={index}>
      {aMsg.username} : {aMsg.message}
    </li>
  );

  return (
    <div className='ChatRoom'>
      <div className='Navbar'>
        <h2>{username}님 접속중</h2>  
        <button className='closeButton' onClick={onDisconnect}>나가기</button>
      </div>    

      <ul className='ChatList'>
        {messageList}
      </ul>

      <form className='MessageInput' onSubmit={e => sendMessageToChatServer(e)}>
        <input value={userInput} onChange={e => setUserInput(e.target.value)} />
        <button type="submit">전송</button>
      </form>
    </div>
  );
}

export default ChatRoom;
