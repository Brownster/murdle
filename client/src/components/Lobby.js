import React from 'react';
import './Lobby.css';

export default function Lobby({ players, onStart }) {
  return (
    <div className="lobby">
      <h2>Lobby</h2>
      <ul className="player-list">
        {players.map((p) => (
          <li key={p.id}>
            {p.avatar && <img src={p.avatar} alt="" className="avatar" />}
            {p.name} {p.solved && '✅'}
          </li>
        ))}
      </ul>
      <button onClick={onStart}>Start Game</button>
    </div>
  );
}
