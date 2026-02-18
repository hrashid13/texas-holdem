import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { socket } from './socket';

const Lobby = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [room, setRoom] = useState(location.state?.room || null);
  const [isHost, setIsHost] = useState(location.state?.isHost || false);
  const [error, setError] = useState('');
  const [myPlayerId, setMyPlayerId] = useState(socket.id);

  useEffect(() => {
    setMyPlayerId(socket.id);

    // Listen for room updates
    socket.on('roomUpdated', (updatedRoom) => {
      setRoom(updatedRoom);
      setIsHost(updatedRoom.host === socket.id);
    });

    // Listen for player leaving
    socket.on('playerLeft', ({ playerId }) => {
      console.log('Player left:', playerId);
    });

    // Listen for game start
    socket.on('gameStarted', ({ players }) => {
      navigate(`/game/${roomCode}`, { state: { players, roomCode } });
    });

    // Listen for errors
    socket.on('error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off('roomUpdated');
      socket.off('playerLeft');
      socket.off('gameStarted');
      socket.off('error');
    };
  }, [roomCode, navigate]);

  const handleToggleReady = () => {
    socket.emit('toggleReady', { roomCode });
  };

  const handleStartGame = () => {
    socket.emit('startGame', { roomCode });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert('Room code copied to clipboard!');
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #065f46, #064e3b)',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  };

  if (!room) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p>Loading room...</p>
        </div>
      </div>
    );
  }

  const allPlayers = [...room.players, ...room.bots];
  const humanPlayers = room.players;
  const allHumansReady = humanPlayers.filter(p => p.id !== room.host).every(p => p.ready);
  const canStart = humanPlayers.length === 1 || allHumansReady; // Solo player or all others ready

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1f2937'
  };

  const roomCodeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f3f4f6',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#059669',
    letterSpacing: '2px'
  };

  const copyButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  };

  const playersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px'
  };

  const playerCardStyle = (isMe) => ({
    backgroundColor: isMe ? '#dbeafe' : '#f3f4f6',
    padding: '15px',
    borderRadius: '8px',
    border: isMe ? '2px solid #2563eb' : 'none'
  });

  const playerNameStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#1f2937'
  };

  const playerStatusStyle = (ready) => ({
    fontSize: '14px',
    color: ready ? '#059669' : '#6b7280'
  });

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '10px'
  };

  const readyButtonStyle = (isReady) => ({
    ...buttonStyle,
    backgroundColor: isReady ? '#dc2626' : '#059669',
    color: 'white'
  });

  const startButtonStyle = {
    ...buttonStyle,
    backgroundColor: canStart ? '#059669' : '#d1d5db',
    color: 'white',
    cursor: canStart ? 'pointer' : 'not-allowed'
  };

  const errorStyle = {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    textAlign: 'center'
  };

  const infoStyle = {
    backgroundColor: '#dbeafe',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    color: '#1e40af',
    textAlign: 'center'
  };

  const mePlayer = humanPlayers.find(p => p.id === myPlayerId);
  const isReady = mePlayer?.ready || false;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Waiting Room</h1>
          <div>
            <span style={roomCodeStyle}>
              {roomCode}
              <button onClick={handleCopyCode} style={copyButtonStyle}>Copy</button>
            </span>
          </div>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={infoStyle}>
          {isHost ? (
            <p>You are the host. All players must ready up before you can start the game.</p>
          ) : (
            <p>Waiting for host to start the game. Click "Ready" when you're prepared to play.</p>
          )}
        </div>

        <h3 style={{ marginBottom: '15px', color: '#374151' }}>
          Players ({allPlayers.length}/6)
        </h3>

        <div style={playersGridStyle}>
          {allPlayers.map((player) => {
            const isMe = player.id === myPlayerId;
            return (
              <div key={player.id} style={playerCardStyle(isMe)}>
                <div style={playerNameStyle}>
                  {player.name} {isMe && '(You)'}
                  {player.id === room.host && ' 👑'}
                </div>
                <div style={playerStatusStyle(player.ready || player.isBot)}>
                  {player.isBot ? '🤖 CPU' : player.ready ? '✅ Ready' : '⏳ Not Ready'}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
                  {player.chips} chips
                </div>
              </div>
            );
          })}
        </div>

        <div>
          {!isHost && (
            <button
              onClick={handleToggleReady}
              style={readyButtonStyle(isReady)}
            >
              {isReady ? 'Not Ready' : 'Ready'}
            </button>
          )}

          {isHost && (
            <button
              onClick={handleStartGame}
              disabled={!canStart}
              style={startButtonStyle}
            >
              {canStart ? 'Start Game' : `Waiting for players to ready up (${humanPlayers.filter(p => p.ready || p.id === room.host).length}/${humanPlayers.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;