"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket("ws://127.0.0.1:8000/ws");

        wsRef.current.onopen = () => {
          console.log("Connected to WebSocket server");
          setConnectionStatus("Connected");
          initializeAudioRecording();
        };

        wsRef.current.onclose = () => {
          console.log("WebSocket connection closed");
          setConnectionStatus("Disconnected - Retrying...");
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionStatus("Error connecting");
        };

        wsRef.current.onmessage = (event) => {
          try {
            const audioData = event.data;
            let newData = audioData.split(";");
            newData[0] = "data:audio/ogg;";
            newData = newData[0] + newData[1];

            const audio = new Audio(newData);
            if (!audio || document.hidden) {
              return;
            }
            audio.play();
          } catch (error) {
            console.error("Error processing audio data:", error);
          }
        };
      } catch (error) {
        console.error("Error creating WebSocket connection:", error);
        setConnectionStatus("Error - Retrying...");
        setTimeout(connectWebSocket, 3000);
      }
    };

    const initializeAudioRecording = () => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          let audioChunks: Blob[] = [];

          mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
          });

          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            audioChunks = [];
            const fileReader = new FileReader();
            fileReader.readAsDataURL(audioBlob);
            fileReader.onloadend = () => {
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(fileReader.result as string);
              }
            };

            startRecordingCycle();
          });

          startRecordingCycle();
        })
        .catch((error) => {
          console.error("Error capturing audio:", error);
          setConnectionStatus("Error accessing microphone");
        });
    };

    const startRecordingCycle = () => {
      if (mediaRecorderRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
        mediaRecorderRef.current.start();
        setTimeout(() => {
          if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
          }
        }, 1000);
      }
    };

    // Initial connection
    connectWebSocket();

    // Cleanup function
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Audio Chat</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-600">Status: {connectionStatus}</p>
      </div>
    </div>
  );
}