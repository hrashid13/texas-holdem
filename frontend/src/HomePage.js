import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket, connectSocket } from './socket';

const HomePage = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [botCount, setBotCount] = useState(3);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsCreating(true);
    setError('');
    connectSocket();

    socket.emit('createRoom', { playerName: playerName.trim(), botCount });

    socket.once('roomCreated', ({ roomCode, room }) => {
      setIsCreating(false);
      navigate(`/lobby/${roomCode}`, { state: { room, isHost: true } });
    });

    socket.once('error', ({ message }) => {
      setError(message);
      setIsCreating(false);
    });
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!roomCode.trim()) {
      setError('Please enter room code');
      return;
    }

    setIsJoining(true);
    setError('');
    connectSocket();

    socket.emit('joinRoom', { roomCode: roomCode.trim().toUpperCase(), playerName: playerName.trim() });

    socket.once('roomJoined', ({ roomCode, room }) => {
      setIsJoining(false);
      navigate(`/lobby/${roomCode}`, { state: { room, isHost: false } });
    });

    socket.once('error', ({ message }) => {
      setError(message);
      setIsJoining(false);
    });
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #065f46, #064e3b)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#1f2937'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '15px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'all 0.2s'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#059669',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2563eb',
    color: 'white'
  };

  const dividerStyle = {
    textAlign: 'center',
    margin: '30px 0',
    color: '#6b7280',
    position: 'relative'
  };

  const errorStyle = {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    textAlign: 'center'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#374151',
    fontWeight: '600'
  };

  const sliderContainerStyle = {
    marginBottom: '20px'
  };

  const sliderStyle = {
    width: '100%',
    marginTop: '8px'
  };

  const sliderValueStyle = {
    textAlign: 'center',
    marginTop: '8px',
    color: '#6b7280',
    fontSize: '14px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>🎰 Texas Hold'em Poker</h1>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={{ marginBottom: '30px' }}>
          <label style={labelStyle}>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={inputStyle}
            maxLength={20}
          />
        </div>

        <div style={sliderContainerStyle}>
          <label style={labelStyle}>Number of CPU Players: {botCount}</label>
          <input
            type="range"
            min="2"
            max="5"
            value={botCount}
            onChange={(e) => setBotCount(parseInt(e.target.value))}
            style={sliderStyle}
          />
          <div style={sliderValueStyle}>
            You + {botCount} bots = {botCount + 1} players total
          </div>
        </div>

        <button
          onClick={handleCreateRoom}
          disabled={isCreating}
          style={primaryButtonStyle}
        >
          {isCreating ? 'Creating Room...' : 'Create Room'}
        </button>

        <div style={dividerStyle}>
          <span style={{ backgroundColor: 'white', padding: '0 10px' }}>OR</span>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: '#d1d5db',
            zIndex: -1
          }}></div>
        </div>

        <div>
          <label style={labelStyle}>Room Code</label>
          <input
            type="text"
            placeholder="Enter room code (e.g., ABC123)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            style={inputStyle}
            maxLength={6}
          />
        </div>

        <button
          onClick={handleJoinRoom}
          disabled={isJoining}
          style={secondaryButtonStyle}
        >
          {isJoining ? 'Joining Room...' : 'Join Room'}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
