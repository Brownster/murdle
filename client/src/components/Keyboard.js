import React from 'react';
import './Keyboard.css';

const KEYS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['enter','z','x','c','v','b','n','m','back']
];

export default function Keyboard({ onKey, states }) {
  const handleClick = (key) => {
    onKey(key);
  };
  return (
    <div className="keyboard">
      {KEYS.map((row, i) => (
        <div key={i} className="kb-row">
          {row.map((k) => (
            <button
              key={k}
              className={`key ${states[k] || ''}`}
              onClick={() => handleClick(k)}
            >
              {k === 'enter' ? 'Enter' : k === 'back' ? '⌫' : k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
