// src/api.js
export const SIGNALING_SERVER_URL = "wss://couples-game-1-us4z.onrender.com";

let socket;

export const connectSocket = () => {
  socket = new WebSocket(SIGNALING_SERVER_URL);

  socket.onopen = () => {
    console.log("✅ Connected to signaling server!");
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  socket.onclose = () => {
    console.warn("⚠️ Disconnected from signaling server. Reconnecting...");
    setTimeout(connectSocket, 3000); // auto reconnect
  };

  return socket;
};

export const sendMessage = (type, payload, room) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type, payload, room }));
  } else {
    console.warn("⚠️ WebSocket not ready to send message.");
  }
};
