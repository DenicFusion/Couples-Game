import React, { useState, useRef, useEffect } from "react";
import questions from "./questions";
import dares from "./dares";
import Chat from "./Chat";
import VoiceChat from "./VoiceChat";
import DrawingBoard from "./DrawingBoard";
import { connectSocket } from './api.js';

const socket = connectSocket();

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function GameRoom({ roomCode, playerName, isInitiator }) {
  const [players, setPlayers] = useState([playerName, "Waiting..."]);
  const [currentPlayer, setCurrentPlayer] = useState(Math.floor(Math.random() * 2));
  const [step, setStep] = useState("question");
  const [currentQuestion, setCurrentQuestion] = useState(getRandomItem(questions));
  const [currentDare, setCurrentDare] = useState("");
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState([0, 0]);
  const [feedbackPhase, setFeedbackPhase] = useState(false);
  const timerRef = useRef();

  // Timer logic
  useEffect(() => {
    clearInterval(timerRef.current);
    if (step === "question" || step === "dare" || feedbackPhase) {
      setTimer(30);
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step, feedbackPhase]);

  useEffect(() => {
    if (timer === 0) {
      if (feedbackPhase) {
        setFeedbackPhase(false);
        nextTurn();
      } else {
        setFeedbackPhase(true);
      }
    }
  }, [timer]);

  // Socket: receive chat messages
  useEffect(() => {
    socket.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat-message");
    };
  }, []);

  const handleTruth = () => setStep("answer");

  const handleDare = () => {
    setCurrentDare(getRandomItem(dares));
    setStep("dare");
  };

  const handleSatisfied = (response) => {
    if (response === "yes") {
      setFeedbackPhase(false);
      nextTurn();
    } else {
      setFeedbackPhase(true);
      setTimer(30); // Give 30 seconds to respond
    }
  };

  const nextTurn = () => {
    setHistory([
      ...history,
      {
        player: players[currentPlayer],
        question: currentQuestion,
        dare: step === "dare" ? currentDare : null,
        answered: step === "answer",
      },
    ]);
    setScore((s) => {
      let ns = [...s];
      if (step === "answer") ns[currentPlayer] += 1;
      if (step === "dare") ns[currentPlayer] += 2;
      return ns;
    });
    setCurrentPlayer((currentPlayer + 1) % 2);
    setCurrentQuestion(getRandomItem(questions));
    setCurrentDare("");
    setStep("question");
    setFeedbackPhase(false);
  };

  const handleChatSend = (msg) => {
    const messageData = {
      roomCode,
      sender: players[currentPlayer],
      text: msg,
    };
    socket.emit("chat-message", messageData); // Send to server
    setMessages((prev) => [...prev, messageData]); // Show locally
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <div style={{ color: "#e75480", fontWeight: "bold", fontSize: 20 }}>
        Room Code: <span style={{ fontFamily: "monospace" }}>{roomCode}</span>
      </div>
      <div style={{ margin: "12px 0" }}>
        <b>Players:</b> {players[0]} vs {players[1]}
      </div>
      <div style={{ marginBottom: 8 }}>
        <b>Score:</b> {players[0]}: {score[0]} | {players[1]}: {score[1]}
      </div>
      <div>
        <span style={{ color: "#e75480" }}>Turn:</span> <b>{players[currentPlayer]}</b>
        <span style={{ float: "right" }}>⏰ {timer}s</span>
      </div>
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
        <div style={{ flex: 2 }}>
          {!feedbackPhase && step === "question" && (
            <>
              <div style={{ fontSize: 18, fontWeight: "bold", margin: "10px 0" }}>Truth or Dare?</div>
              <div style={{ background: "#fff0f5", padding: 18, borderRadius: 10, fontSize: 19 }}>
                {currentQuestion}
              </div>
              <div style={{ marginTop: 12 }}>
                <button onClick={handleTruth} style={{ marginRight: 12 }}>
                  I’ll Answer (Truth)
                </button>
                <button onClick={handleDare}>Double Dare!</button>
              </div>
            </>
          )}
          {!feedbackPhase && step === "answer" && (
            <div>
              <h3>{players[currentPlayer]}:</h3>
              <p>Type your answer out loud or in chat! (Be honest 😉)</p>
              <button onClick={() => setFeedbackPhase(true)} style={{ marginTop: 16 }}>
                Done Answering
              </button>
            </div>
          )}
          {!feedbackPhase && step === "dare" && (
            <div>
              <h3>{players[currentPlayer]}:</h3>
              <div style={{ background: "#fff0f5", padding: 18, borderRadius: 10, fontSize: 18 }}>
                Your Double Dare: {currentDare}
              </div>
              <button onClick={() => setFeedbackPhase(true)} style={{ marginTop: 16 }}>
                Done with Dare
              </button>
            </div>
          )}
          {feedbackPhase && (
            <div style={{ marginTop: 16 }}>
              <h3>Are you satisfied with {players[currentPlayer]}'s response?</h3>
              <button onClick={() => handleSatisfied("yes")} style={{ marginRight: 12 }}>
                Yes 👍
              </button>
              <button onClick={() => handleSatisfied("no")}>No 👎</button>
              <p style={{ marginTop: 8, fontStyle: "italic" }}>
                If “No,” you have 30 seconds to say your mind...
              </p>
            </div>
          )}
          <div style={{ marginTop: 28 }}>
            <h4>📝 Game History</h4>
            <ul style={{ fontSize: 14 }}>
              {history.slice(-10).map((item, idx) => (
                <li key={idx}>
                  <strong>{item.player}</strong> - Q: "{item.question}"{" "}
                  {item.dare && <span>→ Dare: {item.dare}</span>}
                  {item.answered && <span> (Answered)</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <Chat player={players[currentPlayer]} messages={messages} onSend={handleChatSend} />
          <VoiceChat roomCode={roomCode} isInitiator={isInitiator} />
          <DrawingBoard />
        </div>
      </div>
    </div>
  );
}
