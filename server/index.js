const express = require('express');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Load list of possible secret words (one per line)
const wordsPath = path.join(__dirname, 'words.txt');
let WORDS = [];
try {
  WORDS = fs.readFileSync(wordsPath, 'utf8')
    .split(/\r?\n/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
} catch (err) {
  console.error('Failed to load words.txt', err);
}

// Simple in-memory game state
const DEFAULT_ROOM = 'default';
const players = {}; // socket.id -> {id, name, avatar, solved}
const gameState = {
  started: false,
  secret: '',
};

function chooseSecretWord() {
  if (WORDS.length === 0) return null;
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function scoreGuess(secret, guess) {
  const result = Array(secret.length).fill('absent');
  const secretArr = secret.split('');
  const guessArr = guess.split('');

  // Mark correct letters first
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = 'correct';
      secretArr[i] = null; // consume letter
      guessArr[i] = null;
    }
  }

  // Mark present letters
  for (let i = 0; i < guessArr.length; i++) {
    if (!guessArr[i]) continue;
    const idx = secretArr.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i] = 'present';
      secretArr[idx] = null;
    }
  }
  return result;
}

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Handle joining the game lobby
  socket.on('joinGame', ({ name, avatar }) => {
    players[socket.id] = {
      id: socket.id,
      name: name || `Player-${socket.id.substring(0, 5)}`,
      avatar: avatar || null,
      solved: false,
    };
    socket.join(DEFAULT_ROOM);
    io.to(DEFAULT_ROOM).emit('playerList', Object.values(players));
  });

  // Player starts the game
  socket.on('startGame', () => {
    if (gameState.started) return;
    const secret = chooseSecretWord();
    if (!secret) return;
    gameState.started = true;
    gameState.secret = secret;
    for (const p of Object.values(players)) {
      p.solved = false;
    }
    io.to(DEFAULT_ROOM).emit('gameStarted', { length: secret.length });
  });

  // Handle a guess from a player
  socket.on('guess', (guess) => {
    if (!gameState.started) return;
    guess = String(guess || '').toLowerCase();
    if (!guess || guess.length !== gameState.secret.length) return;
    const result = scoreGuess(gameState.secret, guess);
    socket.emit('guessResult', { guess, result });
    io.to(DEFAULT_ROOM).emit('playerGuessed', {
      id: socket.id,
      guess,
      result,
    });
    if (guess === gameState.secret) {
      players[socket.id].solved = true;
      endGame();
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.to(DEFAULT_ROOM).emit('playerList', Object.values(players));
    console.log('user disconnected', socket.id);
  });
});

function endGame() {
  if (!gameState.started) return;
  gameState.started = false;
  io.to(DEFAULT_ROOM).emit('gameOver', {
    secret: gameState.secret,
    players: Object.values(players).map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      solved: p.solved,
    })),
  });
  gameState.secret = '';
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
