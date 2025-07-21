import React, { useState } from 'react';
import './NameModal.css';

export default function NameModal({ onSubmit }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), avatar: avatar.trim() });
  };

  return (
    <div className="modal-backdrop">
      <form className="name-modal" onSubmit={handleSubmit}>
        <h2>Enter Name</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Avatar URL (optional)"
        />
        <button type="submit">Join Game</button>
      </form>
    </div>
  );
}
