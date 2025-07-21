# murdle

This monorepo contains the front-end React client and a Node.js Socket.IO server.
See [docs/roadmap.md](docs/roadmap.md) for the project roadmap.

## Development

- `client/` – React app bootstrapped with Create React App
- `server/` – Express + Socket.IO server

Start both in development:
```bash
cd server && npm install && npm start    # listens on http://localhost:3001
```
In a separate shell:
```bash
cd client && npm install && npm start    # runs CRA dev server on port 3000
```

## Deployment on Render

Deployment settings are documented in [docs/render.md](docs/render.md).
