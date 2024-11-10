'use client';
import MeetingChat from "@/app/components/MeetingChat";
import { useParams } from "next/navigation";

const demoData = {
    members: [
        { id: '1', name: 'Jessie', avatar: '/api/placeholder/40/40', isSelected: true },
        { id: '2', name: 'Mike', avatar: '/api/placeholder/40/40' },
        { id: '3', name: 'Jan', avatar: '/api/placeholder/40/40' },
        { id: '4', name: 'Nicole', avatar: '/api/placeholder/40/40' },
    ],
    messages: [
        { id: '1', member: { id: '4', name: 'Nicole', avatar: '/api/placeholder/40/40' }, text: 'Hey! Are we ready to start?' },
        { id: '2', member: { id: '3', name: 'Jan', avatar: '/api/placeholder/40/40' }, text: 'Glad to hear you all again!' },
        { id: '3', member: { id: '2', name: 'Mike', avatar: '/api/placeholder/40/40' }, text: 'Hello guys' },
    ],
};

export default function MeetingChatPage() {
    const meetingId = useParams().id as string;
    console.log("meeting id: ", meetingId);
    return (
        <div className="min-h-screen bg-[#7000FF]">
            <MeetingChat
                meetingId={meetingId}
                title="Discussing UX Patterns"
                messages={demoData.messages}
                participants={demoData.members}
            />
        </div>
    );
}