# Texas Hold'em Multiplayer Poker

A real-time multiplayer Texas Hold'em poker game built with React, Node.js, and Socket.io. Play with friends online with automatic CPU bot opponents to fill empty seats.

## Features

- **Real-time Multiplayer** - Play with 2-6 players online
- **AI Opponents** - Smart CPU bots automatically fill empty seats
- **Full Texas Hold'em Rules** - Preflop, Flop, Turn, River betting rounds
- **Room-based Gameplay** - Create or join rooms with 6-digit codes
- **Chip Management** - Starting chips with blind betting system
- **No Account Required** - Jump right in and play
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Socket.io Client
- Vanilla CSS (inline styles)

**Backend:**
- Node.js
- Express.js
- Socket.io
- CORS

## Getting Started

### Prerequisites

- Node.js 14+ installed
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/texas-holdem-multiplayer.git
cd texas-holdem-multiplayer
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running Locally

1. **Start the Backend Server**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:3001`

2. **Start the Frontend** (in a new terminal)
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## How to Play

### Creating a Room

1. Enter your name
2. Select number of CPU bots (2-5)
3. Click "Create Room"
4. Share the 6-digit room code with friends

### Joining a Room

1. Enter your name
2. Enter the room code
3. Click "Join Room"

### In the Lobby

- Wait for all players to join
- Players mark themselves as "Ready"
- Host starts the game when ready

### Gameplay

- Players act in turn: **Fold**, **Call/Check**, or **Raise**
- Betting rounds: **Preflop** → **Flop** → **Turn** → **River**
- Best hand wins the pot
- New hands deal automatically

## Game Rules

- **Blinds:** Small blind (10 chips), Big blind (20 chips)
- **Starting Chips:** 1000 chips per player
- **Betting Actions:**
  - **Fold:** Exit the current hand
  - **Call/Check:** Match current bet (or check if bet is 0)
  - **Raise:** Increase the bet (20 or 50 chip raises available)
- **Winning:** Best 5-card hand from 2 hole cards + 5 community cards

## Bot AI

CPU bots use a strategic AI that considers:
- Hand strength (pairs, high cards, suited connectors)
- Community cards (flop, turn, river)
- Position at the table
- Pot odds and stack sizes
- Random variance for unpredictability

## Project Structure

```
texas-holdem-multiplayer/
├── backend/
│   ├── server.js              # Express + Socket.io server
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js             # Main app with routing
│   │   ├── HomePage.js        # Create/join room
│   │   ├── Lobby.js           # Waiting room
│   │   ├── Game.js            # Poker game logic
│   │   ├── socket.js          # Socket.io client
│   │   └── index.js
│   ├── package.json
│   ├── .env
│   └── .env.production
├── .gitignore
└── README.md
```

## Deployment

### Deploy to Railway

#### Backend Deployment

```bash
cd backend
railway login
railway init
railway up
railway domain
```

Set environment variable in Railway dashboard:
- `FRONTEND_URL` = Your frontend Railway URL (without trailing slash)

#### Frontend Deployment

```bash
cd frontend
railway init
railway up
railway domain
```

Set environment variables in Railway dashboard:
- `REACT_APP_SOCKET_URL` = Your backend Railway URL (without trailing slash)
- `CI` = `false`
- `DISABLE_ESLINT_PLUGIN` = `true`

### Alternative: Deploy Frontend to Netlify

```bash
cd frontend
npm run build
# Upload the 'build' folder to Netlify
```

Set environment variable in Netlify:
- `REACT_APP_SOCKET_URL` = Your backend URL

## Environment Variables

### Backend (.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_SOCKET_URL=http://localhost:3001
```

### Frontend (.env.production)
```env
DISABLE_ESLINT_PLUGIN=true
REACT_APP_SOCKET_URL=https://your-backend-url.up.railway.app
```

## Troubleshooting

**Connection Issues:**
- Ensure backend and frontend URLs are correctly set in `.env` files
- Remove trailing slashes from URLs
- Check CORS settings in `server.js`
- Verify firewall/network settings

**Game Stuck:**
- Refresh the page
- Check browser console for errors
- Ensure all environment variables are set

**Deployment Issues:**
- Railway: Set `CI=false` to disable strict linting
- Ensure both services are deployed and running
- Check Railway logs for errors
- Verify CORS allows your frontend URL

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with React and Socket.io
- Poker hand evaluation algorithm
- Inspired by classic Texas Hold'em poker

---

**Enjoy the game!**
