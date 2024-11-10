'use client';
import MeetingChat from "@/app/components/MeetingChat";
import { useDatabase } from "@/app/providers/AppContext";
import { getMeetingMessages, getMeetingUsers } from "@/lib/helpers";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CustomUser, Message } from "@/lib/API";
import { ref, get } from "firebase/database";

export default function MeetingChatPage() {
    const meetingId = useParams().id as string;
    const db = useDatabase();
    const [members, setMembers] = useState<CustomUser[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [meetingTitle, setMeetingTitle] = useState<string>("");

    const loadChatDetails = async () => {
        const members = await getMeetingUsers(db, meetingId);
        setMembers(members);
        
        const messages = await getMeetingMessages(db, meetingId);
        setMessages(messages);
        
        // Get the meeting reference and fetch the data
        const meetingRef = ref(db, `meetings/${meetingId}`);
        const meetingSnapshot = await get(meetingRef);
    
        if (meetingSnapshot.exists()) {
            const meetingData = meetingSnapshot.val();
            setMeetingTitle(meetingData.title); // Assuming you have a state setter for the title
        } else {
            console.log("No meeting data available");
        }
    };

    useEffect(() => {
        loadChatDetails();
    }, []);

    return (
        <div className="min-h-screen bg-[#7000FF]">
            <MeetingChat
                meetingId={meetingId}
                title={meetingTitle}
                messages={messages}
                participants={members}
                db={db}
            />
        </div>
    );
}