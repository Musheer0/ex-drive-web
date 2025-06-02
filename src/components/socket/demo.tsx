'use client';
import { useEffect, useState } from 'react';
import useSocket from '@/hooks/use-socket';

const Home = () => {
  const socketRef = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleMessage = (msg: string) => {
        console.log('hello')
      setMessages(prev => [...prev, msg]);
    };

    socket.on('chat', handleMessage);

    return () => {
      socket.off('chat', handleMessage);
    };
  }, [socketRef]);

  const sendMessage = () => {
    const socket = socketRef.current;
    if (!socket || input.trim() === '') return;

    socket.emit('chat', input.trim());
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h1>🔥 Real-Time Chat</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            padding: '0.5rem',
            width: '100%',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginTop: '0.5rem',
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {messages.map((msg, idx) => (
          <li
            key={idx}
            style={{
              padding: '0.5rem',
              borderRadius: '5px',
              marginBottom: '0.5rem',
            }}
          >
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
