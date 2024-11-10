'use client';
import MeetingChat from "@/app/components/MeetingChat";
import { useDatabase } from "@/app/providers/AppContext";
import { getMeetingMessages, getMeetingUsers } from "@/lib/helpers";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CustomUser, Message } from "@/lib/API";

export default function MeetingChatPage() {
    const meetingId = useParams().id as string;
    const db = useDatabase();
    const [members, setMembers] = useState<CustomUser[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    const loadChatDetails = async () => {
        const members = await getMeetingUsers(db, meetingId);
        setMembers(members);
        const messages = await getMeetingMessages(db, meetingId);
        setMessages(messages);
    };

    useEffect(() => {
        loadChatDetails();
    }, []);

    return (
        <div className="min-h-screen bg-[#7000FF]">
            <MeetingChat
                meetingId={meetingId}
                title="Discussing UX Patterns"
                messages={messages}
                participants={members}
                db={db}
            />
        </div>
    );
}