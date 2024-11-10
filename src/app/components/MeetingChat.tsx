"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconButton, Avatar, Button, TextareaAutosize } from "@mui/material";
import { Close, Chat, Mic, PanTool } from "@mui/icons-material";
import Link from "next/link";
import { CustomUser, Member, Message } from "@/lib/API";
import { useRouter } from "next/navigation";
import { FcEndCall } from "react-icons/fc";
import { createObject, updateObject } from "@/lib/mutations";
import { Database, ref, onValue, set, query, orderByChild, equalTo } from "firebase/database";
import { useTenantId, useUserId } from "../providers/AppContext";

interface MeetingChatProps {
  title: string;
  messages: Message[]
  participants: CustomUser[];
  meetingId: string;
  db: Database;
}

const MeetingChat: React.FC<MeetingChatProps> = ({
  title,
  //messages,
  participants,
  meetingId,
  db,
}) => {
  const router = useRouter();
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  // const userId = useUserId();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef(null);
  const tenantId = useTenantId();
  const userId = useUserId();
  //const [transcripts] = useState<string[]>([]);

  // useEffect(() => {
  //     const ws = new WebSocket(`ws://localhost:8000/ws/meeting/${meetingId}/`);
  //     setSocket(ws);

  //     ws.onopen = () => {
  //         console.log('WebSocket connection opened');
  //         ws.send(JSON.stringify({ user_id: userId }));
  //         startRecording(ws);
  //     };

  //     ws.onclose = () => {
  //         console.log('WebSocket connection closed');
  //     };

  //     ws.onerror = (error) => {
  //         console.log('WebSocket error:', error);
  //         router.push('/');
  //     };

  //     ws.onmessage = async (event) => {
  //         console.log('WebSocket message received:', event.data);
  //         console.log('Type:', typeof event.data);
  //         if (typeof event.data === 'string') {
  //             const json = await JSON.parse(event.data);
  //             if ("auth" in json) {
  //                 console.log('Authenticated:', json.auth);
  //                 return ;
  //             } else if ("error" in json) {
  //                 console.error('Error:', json.error);
  //                 return ;
  //             }
  //             const transcript = json;
  //             setTranscripts([...transcripts, transcript]);
  //         } else {
  //             const blob = new Blob([event.data], { type: 'audio/webm' });
  //             const url = URL.createObjectURL(blob);
  //             const audio = new Audio(url);
  //             audio.play();
  //         }
  //     }

  //     return () => {
  //         ws.close();
  //     };

  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [meetingId, transcripts]);

  // const startRecording = useCallback((socket: WebSocket) => {

  //     console.log('Starting recording...');
  //     if (!socket) return;

  //     console.log('Starting recording...');

  //     navigator.mediaDevices.getUserMedia({ audio: true })
  //         .then((stream) => {
  //             const mediaRecorder = new MediaRecorder(stream);
  //             mediaRecorder.start(100);

  //             console.log('MediaRecorder started:', mediaRecorder.state);

  //             mediaRecorder.ondataavailable = (event) => {
  //                 if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
  //                     socket.send(event.data);
  //                 }
  //             };

  //             mediaRecorder.onstop = () => {
  //                 stream.getTracks().forEach(track => track.stop());
  //             };
  //         })
  //         .catch((error) => {
  //             console.error('Error accessing microphone:', error);
  //         });

  //         // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [socket]);

  const handleEndMeeting = async () => {
    console.log("End Meeting");
    const updateMeeting = await updateObject(db, "meetings", meetingId, {
      endAt: new Date().toISOString(),
    });

    console.log("Updated Meeting: ", updateMeeting);
    router.push(`/meetings/${meetingId}`);
  };

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Reference to all messages in the database
    const messagesRef = ref(db, 'messages');

    // Query the messages where 'meetingId' matches the specified meetingId
    const messagesQuery = query(messagesRef, orderByChild('meetingId'), equalTo(meetingId));

    // Subscribe to real-time updates
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        // Convert the messages data to an array of objects with id and data
        const messagesList = Object.entries(messagesData).map(([id, data]) => ({
          id,
          data,
        }));

        // Append new messages to the existing list (avoiding full reset)
        setMessages((prevMessages) => {
          const messageIds = prevMessages.map((msg) => msg.id);
          const newMessages = (messagesList as Message[]).filter((msg) => !messageIds.includes(msg.id));
          return [...prevMessages, ...newMessages];
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
      }
    })
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
          const sender = getMessageSender(messageObject.data.senderId) as CustomUser;
          const isCurrentUser = messageObject.data.senderId === userId;

          return (
            <div
              key={messageObject.id}
              className={`flex items-start space-x-3 ${
                isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <Avatar src={sender.data ? sender.data.profileURL : ""} className="w-8 h-8" />
              <div
                className={`max-w-[70%] ${isCurrentUser ? "text-right" : ""}`}
              >
                <p className="text-sm text-gray-300 mb-1">{sender.data ? (sender.data.firstName + " " + sender.data.lastName) : "Unkown User"}</p>
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
              <Avatar src={participant.data.lastName} className="w-10 h-10" />
              <p className="text-sm whitespace-nowrap">{participant.data.firstName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingChat;
