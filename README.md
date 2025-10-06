# Dare Couples Game

A fun, real-time web game for couples: truth/dare, chat, voice, drawing, and more!  
Play together from anywhere using a secure room code.

---

## Features

- 400+ spicy/funny/romantic questions & dares
- Real-time chat (text)
- Real-time voice chat (WebRTC peer-to-peer)
- Drawing board for creative dares
- Timer and scoring system
- Join with a private room code — play across the globe!

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/DenicFusion/dare-couples-game.git
cd dare-couples-game
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the backend signaling server

```bash
npm run server
```
The signaling server will run on port 3001 by default.  
**Deploy this to [Render](https://render.com/), [Railway](https://railway.app/), [Glitch](https://glitch.com/), etc. for production use.**

**If deploying, update `src/api.js` with your public signaling server URL!**

### 4. Start the React frontend

In a new terminal:

```bash
npm start
```
Visit [http://localhost:3000](http://localhost:3000) to play!

---

## Deploying

### Backend (Signaling Server)

- Deploy `server/signaling.js` to a Node.js-friendly host (Render, Railway, Glitch, Heroku, etc.)
- Set the `SIGNALING_SERVER_URL` in `src/api.js` to your deployed backend's public WebSocket address (e.g. `wss://your-app.onrender.com`).

### Frontend

- Deploy the React app (`src/`) to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/).
- Make sure your deployed frontend points to the correct signaling server URL.

---

## How to Play

1. Go to the website.
2. Enter your name.
3. Create a room (share the code) or join a room using a code.
4. Play with truth/dare, chat, voice, and drawing board!

---

## Customization

- Add more questions/dares in `src/questions.js` and `src/dares.js`.
- Tweak scoring, timer, or UI as you wish!

---

## Troubleshooting

- Voice chat requires microphone permissions.  
- Both players must be on the same deployed version and use the same room code.
- For WebRTC to work, backend signaling server **must** be accessible via HTTPS/WSS in production.

---

## License

MIT — Have fun and play responsibly!

---

_Made with ❤️ by DenicFX_
