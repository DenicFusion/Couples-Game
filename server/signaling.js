// Simple Node.js WebSocket signaling server for WebRTC (simple-peer)
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

// ✅ Allow only your Netlify frontend
app.use(cors({
  origin: ['https://couples-gamess.netlify.app'],
  methods: ['GET', 'POST'],
}));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let rooms = {};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      return;
    }

    const { type, room, payload } = data;

    if (type === 'join') {
      ws.room = room;
      rooms[room] = rooms[room] || [];
      rooms[room].push(ws);
      rooms[room] = rooms[room].slice(-2); // Only 2 peers per room

      if (rooms[room].length === 2) {
        rooms[room].forEach(client =>
          client.send(JSON.stringify({ type: 'ready' }))
        );
      }
    }

    if (type === 'signal' && rooms[room]) {
      rooms[room].forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'signal', payload }));
        }
      });
    }

    if (type === 'leave' && rooms[room]) {
      rooms[room] = rooms[room].filter(client => client !== ws);
      if (rooms[room].length === 0) delete rooms[room];
    }
  });

  ws.on('close', function () {
    if (ws.room && rooms[ws.room]) {
      rooms[ws.room] = rooms[ws.room].filter(client => client !== ws);
      if (rooms[ws.room].length === 0) delete rooms[ws.room];
    }
  });
});

app.get('/', (req, res) => res.send('✅ Signaling server is running!'));

// ✅ Keep Render awake (ping self every 14 minutes)
setInterval(() => {
  const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'couples-game-1-us4z.onrender.com'}/`;
  fetch(url)
    .then(() => console.log('Pinged self to stay awake'))
    .catch(() => {});
}, 14 * 60 * 1000);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Signaling server listening on port ${PORT}`);
});
