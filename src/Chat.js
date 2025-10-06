import React, { useState, useRef, useEffect } from "react";

export default function Chat({ player, messages, onSend }) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend({ player, text: input.trim(), time: new Date().toLocaleTimeString() });
    setInput("");
  };

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 10, marginTop: 18, maxHeight: 220, display: "flex", flexDirection: "column", background: "#fafaff" }}>
      <h4 style={{ margin: 0, marginBottom: 8 }}>ðŸ’¬ Couple Chat</h4>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 6, fontSize: 15 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "3px 0", textAlign: msg.player === player ? "right" : "left" }}>
            <span style={{ background: msg.player === player ? "#e0ffe0" : "#f0f0ff", padding: "2px 8px", borderRadius: 10 }}>
              <b>{msg.player}:</b> {msg.text}
            </span>
            <span style={{ color: "#aaa", fontSize: 11, marginLeft: 5 }}>{msg.time}</span>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", marginTop: 6 }}>
        <input
          style={{ flex: 1, borderRadius: 8, border: "1px solid #ccc", padding: 6, marginRight: 4 }}
          placeholder="Type a messageâ€¦"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" style={{ borderRadius: 8, padding: "0 12px" }}>Send</button>
      </form>
    </div>
  );
          }
