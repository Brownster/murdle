import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import NameModal from './components/NameModal';
import Lobby from './components/Lobby';
import WordleBoard from './components/WordleBoard';
import Keyboard from './components/Keyboard';
import './App.css';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [inGame, setInGame] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [results, setResults] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [kbStates, setKbStates] = useState({});
  const wordLength = 5;

  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ['websocket'] });
    setSocket(s);
    s.on('connect', () => setConnected(true));
    s.on('playerList', (list) => setPlayers(list));
    s.on('gameStarted', ({ length }) => {
      setInGame(true);
      setGuesses([]);
      setResults([]);
      setCurrentGuess('');
      setKbStates({});
    });
    s.on('guessResult', ({ guess, result }) => {
      setGuesses((g) => [...g, guess]);
      setResults((r) => [...r, result]);
      updateKeyboardStates(result, guess);
      setCurrentGuess('');
    });
    s.on('gameOver', () => {
      setInGame(false);
    });
    return () => s.close();
  }, []);

  const updateKeyboardStates = (result, guess) => {
    setKbStates((prev) => {
      const next = { ...prev };
      result.forEach((state, idx) => {
        const letter = guess[idx];
        const prevState = next[letter];
        const order = { correct: 3, present: 2, absent: 1 };
        if (!prevState || order[state] > order[prevState]) {
          next[letter] = state;
        }
      });
      return next;
    });
  };

  const handleNameSubmit = ({ name, avatar }) => {
    setPlayer({ name, avatar });
    socket.emit('joinGame', { name, avatar });
  };

  const handleStartGame = () => {
    socket.emit('startGame');
  };

  const handleKey = (key) => {
    if (!inGame) return;
    if (key === 'enter') {
      if (currentGuess.length === wordLength) {
        socket.emit('guess', currentGuess);
      }
    } else if (key === 'back') {
      setCurrentGuess((g) => g.slice(0, -1));
    } else if (/^[a-z]$/.test(key) && currentGuess.length < wordLength) {
      setCurrentGuess((g) => g + key);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter') handleKey('enter');
      else if (e.key === 'Backspace') handleKey('back');
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toLowerCase());
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div className="App">
      {!player && <NameModal onSubmit={handleNameSubmit} />}
      {player && !inGame && (
        <Lobby players={players} onStart={handleStartGame} />
      )}
      {player && inGame && (
        <div className="game">
          <WordleBoard
            guesses={guesses}
            results={results}
            currentGuess={currentGuess}
          />
          <Keyboard onKey={handleKey} states={kbStates} />
        </div>
      )}
    </div>
  );
}

export default App;
