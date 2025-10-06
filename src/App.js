import React, { useState } from "react";
import GameRoom from "./GameRoom";

function randomRoomCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

export default function App() {
  const [stage, setStage] = useState("lobby");
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isInitiator, setIsInitiator] = useState(false);

  if (stage === "lobby") {
    return (
      <div style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
        <h1 style={{ color: "#e75480" }}>ðŸ’– Dare or Double Dare: Couples Edition ðŸ’–</h1>
        <input
          placeholder="Your Name"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          style={{ margin: "8px 0", width: "80%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <br />
        <button
          style={{ margin: "8px 0", padding: "8px 24px", borderRadius: 8, background: "#e75480", color: "#fff" }}
          onClick={() => {
            setRoomCode(randomRoomCode());
            setIsInitiator(true);
            setStage("game");
          }}>
          Create Room
        </button>
        <div style={{ margin: "18px 0", color: "#888" }}>or</div>
        <input
          placeholder="Room Code"
          value={roomCode}
          onChange={e => setRoomCode(e.target.value.toUpperCase())}
          style={{ margin: "8px 0", width: "80%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <br />
        <button
          style={{ margin: "8px 0", padding: "8px 24px", borderRadius: 8, background: "#e75480", color: "#fff" }}
          disabled={!roomCode}
          onClick={() => {
            setIsInitiator(false);
            setStage("game");
          }}>
          Join Room
        </button>
        <footer style={{ marginTop: 40, fontSize: 12, color: "#999" }}>
          Made for couples who love fun! ðŸ’‹<br />
        </footer>
      </div>
    );
  }

  return (
    <GameRoom roomCode={roomCode} playerName={playerName} isInitiator={isInitiator} />
  );
                                     }
