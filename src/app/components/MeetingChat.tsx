"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconButton, Avatar, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import Link from "next/link";
import { CustomUser, Message } from "@/lib/API";
import { useRouter } from "next/navigation";
import { createObject, updateObject } from "@/lib/mutations";
import {
  Database,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";
import { useTenantId, useUserId } from "../providers/AppContext";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

interface MeetingChatProps {
  title: string;
  messages: Message[];
  participants: CustomUser[];
  meetingId: string;
  db: Database;
}

const MeetingChat: React.FC<MeetingChatProps> = ({
  title,
  participants,
  meetingId,
  db,
}) => {
  const router = useRouter();
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioSocket, setAudioSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const tenantId = useTenantId();
  const userId = useUserId();
  const mediaSource = new MediaSource();
  const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

  const audioElement = document.createElement("audio");
  audioElement.autoplay = true;
  audioElement.controls = true;
  audioElement.src = URL.createObjectURL(mediaSource);

  let sourceBuffer: SourceBuffer | null = null;
  const bufferQueue: BufferSource[] = [];
  mediaSource.addEventListener("sourceopen", () => {
    try {
      sourceBuffer = mediaSource.addSourceBuffer("audio/webm; codecs=opus");
      sourceBuffer.mode = "sequence";

      sourceBuffer.addEventListener("updateend", () => {
        if (bufferQueue.length > 0 && !sourceBuffer?.updating) {
          const chunk = bufferQueue.shift();
          if (chunk) {
            sourceBuffer?.appendBuffer(chunk);
          }
        }
      });
    } catch (error) {
      console.error("Error creating source buffer:", error);
    }
  });

  const userStillTalking = () => {
    const messagesLength = messages.length;
    return (
      messagesLength > 0 &&
      messages[messagesLength - 1].data.senderId === userId
    );
  };

  async function handleUpdateChat(transcript: string) {
    try {
      if (userStillTalking()) {
        console.log("User is still talking. Update message content...");
        const lastMessage = messages[messages.length - 1];
        lastMessage.data.content += transcript;

        console.log("Updated message: ", lastMessage);
        updateObject(db, "messages", lastMessage.id, lastMessage.data);
      } else {
        console.log("User started talking again. Create new message...");
        // Otherwise create a new message
        const updatedMessage: Message["data"] = {
          content: transcript,
          createdAt: new Date().toISOString(),
          senderId: userId as string,
          meetingId: meetingId,
          tenantId: tenantId as string,
        };

        const response = await createObject(db, "messages", {
          data: updatedMessage,
        });
        console.log("Response: ", response);
      }
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  }

  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_CHAT_WEB_SOCKET_URL}/${meetingId}`;
      console.log("Web Socket endpoint: ", endpoint);

      // const wsMessage = new WebSocket(`${endpoint}/messages`);
      const wsAudio = new WebSocket(`${endpoint}/audio`);
      wsAudio.binaryType = "arraybuffer";

      wsAudio.onopen = () => {
        console.log("Audio Connection opened.");
        wsAudio.send(JSON.stringify({ user_id: userId }));
      };
      wsAudio.onerror = (event: Event) => {
        const error = event as ErrorEvent;
        console.error("Audio WebSocket error:", error.message);
      };
      wsAudio.onclose = (event: CloseEvent) => {
        console.log("Audio WebSocket closed:", event.reason);
      };

      wsAudio.onmessage = async (event) => {
        if (event.data instanceof ArrayBuffer) {
          // Queue buffers if sourceBuffer isn't ready yet
          if (!sourceBuffer || mediaSource.readyState !== "open") {
            console.log("Buffering audio data...");
            bufferQueue.push(event.data);
            return;
          }

          // Append buffer or queue if busy
          if (sourceBuffer.updating) {
            bufferQueue.push(event.data);
          } else {
            try {
              sourceBuffer.appendBuffer(event.data);
            } catch (error) {
              console.error("Error appending buffer:", error);
            }
          }
        }
      };

      const dgConnection = deepgram.listen.live({
        language: "en-US",
        model: "nova",
        punctuate: true,
        keepAlive: true,
      });
      dgConnection.on(LiveTranscriptionEvents.Open, (data) => {
        console.log("Deepgram connection opened: ", data);
      });

      dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
        console.log("Deepgram Transcript data: ", data);
        const transcript = data.channel.alternatives[0].transcript;
        console.log("Transcript: ", transcript);
        if (transcript.length !== 0) {
          handleUpdateChat(transcript);
        }
      });

      dgConnection.on(LiveTranscriptionEvents.Error, (error) => {
        console.error("Deepgram error:", error);
      });

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });

        mediaRecorder.ondataavailable = async (event) => {
          console.log("Audio data available: ", event.data);
          if (wsAudio.readyState !== WebSocket.OPEN) {
            console.log("Audio WebSocket not open. Skipping...");
            return;
          }
          wsAudio.send(event.data);
          dgConnection.send(event.data);
        };
        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };
        mediaRecorder.start(1);
        setRecorder(mediaRecorder);
      });

      setAudioSocket(wsAudio);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  const stopRecording = () => {
    setIsRecording(false);
    console.log("Closing web socket...");
    audioSocket?.close();
    recorder?.stop();
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleEndMeeting = async () => {
    console.log("End Meeting");
    const updateMeeting = await updateObject(db, "meetings", meetingId, {
      endAt: new Date().toISOString(),
    });

    console.log("Updated Meeting: ", updateMeeting);
    router.push(`/meetings/${meetingId}`);
  };

  useEffect(() => {
    // Reference to all messages in the database
    const messagesRef = ref(db, "messages");

    // Query the messages where 'meetingId' matches the specified meetingId
    const messagesQuery = query(
      messagesRef,
      orderByChild("meetingId"),
      equalTo(meetingId)
    );

    // Subscribe to real-time updates
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messagesData = snapshot.val();
      console.log("Messages Data: ", messagesData);
      if (messagesData) {
        // Convert the messages data to an array of objects with id and data
        const messagesList = Object.entries(messagesData).map(([id, data]) => ({
          id,
          data,
        }));

        setMessages((prevMessages) => {
          const messageMap = new Map(prevMessages.map((msg) => [msg.id, msg]));
          (messagesList as Message[]).forEach((msg) => {
            if (messageMap.has(msg.id)) {
              // Update the content if the message already exists
              const existingMessage = messageMap.get(msg.id);
              if (
                existingMessage &&
                existingMessage.data.content !== msg.data.content
              ) {
                existingMessage.data.content = msg.data.content;
              }
            } else {
              // Add new messages
              messageMap.set(msg.id, msg);
            }
          });

          return Array.from(messageMap.values());
        });
      } else {
        // If no messages for this meetingId, clear the list
        setMessages([]);
      }
    });

    // Cleanup function to unsubscribe when the component unmounts or when meetingId changes
    return () => {
      unsubscribe();
    };
  }, [meetingId]); // Dependency array ensures effect runs when meetingId changes

  // Send message handler
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const response = await createObject(db, "messages", {
      data: {
        content: newMessage,
        createdAt: new Date().toISOString(),
        senderId: userId,
        meetingId: meetingId,
        tenantId: tenantId,
      },
    });
    console.log("Response: ", response);

    setNewMessage("");
  };

  const getMessageSender = (senderId: string) => {
    return (
      participants.find((p) => p.id === senderId) || {
        name: "Unknown User",
        profileURL: "",
      }
    );
  };

  return (
    <div className="flex flex-col h-screen text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleStartRecording}
              disabled={isRecording}
              className={`px-4 py-2 rounded-full font-semibold ${
                isRecording
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Start Recording
            </Button>
            <Button
              onClick={handleStopRecording}
              disabled={!isRecording}
              className={`px-4 py-2 rounded-full font-semibold ${
                !isRecording
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Stop Recording
            </Button>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              Live
            </span>
            <Link href={`/meetings/${meetingId}`}>
              <IconButton>
                <Close className="h-5 w-5" />
              </IconButton>
            </Link>
            <Button
              onClick={handleEndMeeting}
              className="bg-red-500 hover:bg-red-600 text-white px-1 rounded-full font-semibold"
            >
              End Meeting
            </Button>
          </div>
        </div>
      </div>
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {messages.map((message) => {
          const messageObject = message as Message;
          const sender = getMessageSender(
            messageObject.data.senderId
          ) as CustomUser;
          const isCurrentUser = messageObject.data.senderId === userId;

          return (
            <div
              key={messageObject.id}
              className={`flex items-start space-x-3 ${
                isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <Avatar
                src={sender.data ? sender.data.profileURL : ""}
                className="w-8 h-8"
              />
              <div
                className={`max-w-[70%] ${isCurrentUser ? "text-right" : ""}`}
              >
                <p className="text-sm text-gray-300 mb-1">
                  {sender.data
                    ? sender.data.firstName + " " + sender.data.lastName
                    : "Unkown User"}
                </p>
                <div
                  className={`rounded-lg p-3 ${
                    isCurrentUser ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  <p className="text-sm">{messageObject.data.content}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Message Input */}
      <div className="p-6 border-t border-white/10 bg-gray-800">
        <form
          onSubmit={() => handleSendMessage}
          className="flex space-x-4 items-center"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 text-white bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Send
          </Button>
        </form>
      </div>
      {/* Participants */}
      <div className="fixed bottom-24 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex flex-col items-center space-y-1"
            >
              <Avatar src={participant.data.profileURL} className="w-10 h-10" />
              <p className="text-sm whitespace-nowrap">
                {participant.data.firstName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingChat;
