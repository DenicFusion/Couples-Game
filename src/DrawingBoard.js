import React, { useRef, useState } from "react";

export default function DrawingBoard() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const startDraw = (e) => {
    setDrawing(true);
    draw(e);
  };
  const endDraw = () => setDrawing(false);

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#e75480";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h4>🎨 Drawing Board</h4>
      <canvas
        ref={canvasRef}
        width={250}
        height={150}
        style={{ border: "1px solid #aaa", borderRadius: 6, background: "#fff" }}
        onMouseDown={startDraw}
        onMouseUp={endDraw}
        onMouseOut={endDraw}
        onMouseMove={draw}
      />
      <div>
        <button onClick={clear}>Clear</button>
      </div>
      <div style={{ fontSize: 12, color: "#888" }}>Tip: Great for drawing as part of a dare!</div>
    </div>
  );
}
