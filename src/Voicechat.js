import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { SIGNALING_SERVER_URL } from "./api";

export default function VoiceChat({ roomCode, isInitiator }) {
  const [status, setStatus] = useState("disconnected");
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const wsRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!roomCode) return;

    wsRef.current = new WebSocket(SIGNALING_SERVER_URL.replace(/^http/, "ws"));
    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({ type: "join", room: roomCode }));
      setStatus("waiting");
    };

    wsRef.current.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "ready") {
        // Both peers are in the room, start peer connection
        startPeer();
      }
      if (data.type === "signal" && peer) {
        peer.signal(data.payload);
      }
    };

    return () => {
      wsRef.current?.close();
      peer?.destroy();
      setStatus("disconnected");
    };
    // eslint-disable-next-line
  }, [roomCode]);

  const startPeer = async () => {
    setStatus("connecting");
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(mediaStream);

    const newPeer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
      stream: mediaStream,
    });

    newPeer.on("signal", (data) => {
      wsRef.current.send(JSON.stringify({ type: "signal", room: roomCode, payload: data }));
    });

    newPeer.on("stream", (remoteStream) => {
      setRemoteStream(remoteStream);
      setStatus("connected");
    });

    newPeer.on("error", (err) => {
      setStatus("error");
      console.error(err);
    });

    setPeer(newPeer);
  };

  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play();
    }
  }, [remoteStream]);

  const stop = () => {
    peer?.destroy();
    setPeer(null);
    setStatus("disconnected");
    setRemoteStream(null);
    stream?.getTracks().forEach((track) => track.stop());
  };

  if (!roomCode) return null;

  return (
    <div style={{ marginTop: 18, padding: 10, border: "1px solid #eee", borderRadius: 8, background: "#fff8ee" }}>
      <h4>🎤 Voice Chat</h4>
      <div>Status: {status}</div>
      {status === "connected" && (
        <audio ref={audioRef} controls autoPlay style={{ width: "100%", marginBottom: 8 }} />
      )}
      {(status === "connecting" || status === "waiting") && <div>Waiting for connection...</div>}
      {status === "connected" && (
        <button onClick={stop}>End Call</button>
      )}
    </div>
  );
    }
