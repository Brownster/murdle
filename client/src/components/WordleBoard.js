import React from 'react';
import './WordleBoard.css';

const ROWS = 6;
const COLS = 5;

export default function WordleBoard({ guesses, results, currentGuess }) {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    const guess = guesses[i] || '';
    const res = results[i] || [];
    const isCurrent = i === guesses.length;
    const letters = [];
    for (let j = 0; j < COLS; j++) {
      const char = isCurrent ? currentGuess[j] || '' : guess[j] || '';
      const state = res[j];
      letters.push(
        <div key={j} className={`tile ${state || ''}`}>{char}</div>
      );
    }
    rows.push(
      <div key={i} className="row">
        {letters}
      </div>
    );
  }
  return <div className="board">{rows}</div>;
}
