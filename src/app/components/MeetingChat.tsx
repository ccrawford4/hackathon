"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { IconButton, Avatar } from '@mui/material';
import { Close, Chat, Mic, PanTool } from '@mui/icons-material';
import Link from 'next/link';
import { Member } from '@/lib/API';
import { useUserId } from '../providers/AppContext';

interface MeetingChatProps {
    title: string;
    messages: {
        id: string;
        member: Member;
        text: string;
    }[];
    participants: Member[];
    meetingId: string;
}

const MeetingChat: React.FC<MeetingChatProps> = ({
    title,
    messages,
    participants,
    meetingId,
}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const userId = useUserId();

    const [transcripts, setTranscripts] = useState<string[]>([]);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/meeting/${meetingId}/`);
        setSocket(ws);

        ws.onopen = () => {
            console.log('WebSocket connection opened');
            ws.send(JSON.stringify({ user_id: userId }));
            startRecording(ws);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onmessage = async (event) => {
            console.log('WebSocket message received:', event.data);
            console.log('Type:', typeof event.data);
            if (typeof event.data === 'string') {
                const json = await JSON.parse(event.data);
                if ("auth" in json) {
                    console.log('Authenticated:', json.auth);
                    return ;
                } else if ("error" in json) {
                    console.error('Error:', json.error);
                    return ;
                }
                const transcript = json;
                setTranscripts([...transcripts, transcript]);
            } else {
                const blob = new Blob([event.data], { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.play();
            }
        }

        return () => {
            ws.close();
        };
    }, [meetingId, transcripts]);

    const startRecording = useCallback((socket: WebSocket) => {

        console.log('Starting recording...');
        if (!socket) return;

        console.log('Starting recording...');

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start(100);

                console.log('MediaRecorder started:', mediaRecorder.state);

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                        socket.send(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    stream.getTracks().forEach(track => track.stop());
                };
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    }, [socket]);

    return (
        <div className="text-white">
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <div className="flex items-center space-x-2">
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                            Live
                        </span>
                        <Link href={`/meetings/${meetingId}`}>
                            <IconButton color="inherit">
                                <Close />
                            </IconButton>
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <Avatar
                        src={participants[0]?.avatar}
                        className="w-24 h-24 mx-auto mb-8"
                    />
                </div>

                <div className="space-y-4 mb-8">
                    {messages.map((message) => (
                        <div key={message.id} className="flex items-center space-x-3">
                            <Avatar src={message.member.avatar} />
                            <div>
                                <p className="text-sm text-gray-200">{message.member.name}</p>
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6">
                <div className="flex justify-center space-x-8 mb-4">
                    <IconButton id="recordButton" className="bg-white bg-opacity-20">
                        <Chat />
                    </IconButton>
                    <IconButton id="stopButton" className="bg-white" disabled>
                        <Mic />
                    </IconButton>
                    <IconButton className="bg-white bg-opacity-20">
                        <PanTool />
                    </IconButton>
                </div>

                <div className="flex overflow-x-auto space-x-4 pb-4">
                    {participants.map((participant) => (
                        <div
                            key={participant.id}
                            className="flex flex-col items-center space-y-1"
                        >
                            <Avatar src={participant.avatar} />
                            <p className="text-sm whitespace-nowrap">{participant.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <pre>
                {JSON.stringify(transcripts, null, 2)}
            </pre>
        </div>
    );
};

export default MeetingChat;