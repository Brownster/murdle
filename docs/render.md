# Deploying to Render

## Front-end (React)
- Build command: `npm run build`
- Static publish directory: `build`

## Back-end (Node.js)
- Start command: `npm start`
- Port: leave blank (Render sets `PORT` environment variable)

Update the `REACT_APP_SOCKET_URL` environment variable in the front-end to point to the deployed server URL.
