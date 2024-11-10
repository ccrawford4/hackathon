"use client";
import React from 'react';
import { IconButton, Avatar } from '@mui/material';
import { Close, Chat, Mic, PanTool } from '@mui/icons-material';
import Link from 'next/link';
import { Member } from '@/lib/API';

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
                    <IconButton className="bg-white bg-opacity-20">
                        <Chat />
                    </IconButton>
                    <IconButton className="bg-white">
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
        </div>
    );
};

export default MeetingChat;