// Simple Node.js WebSocket signaling server for WebRTC (simple-peer)
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let rooms = {};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) { return; }
    const { type, room, payload } = data;

    if (type === 'join') {
      ws.room = room;
      rooms[room] = rooms[room] || [];
      rooms[room].push(ws);
      rooms[room] = rooms[room].slice(-2);
      if (rooms[room].length === 2) {
        rooms[room].forEach(client => client.send(JSON.stringify({ type: 'ready' })));
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
    }
  });

  ws.on('close', function() {
    if (ws.room && rooms[ws.room]) {
      rooms[ws.room] = rooms[ws.room].filter(client => client !== ws);
    }
  });
});

app.get('/', (req, res) => res.send('Signaling server is running!'));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Signaling server listening on port ${PORT}`);
});
