'use client';

import MeetingDetails from '../../components/meeting/MeetingDetails';
import { redirect } from 'next/navigation';

const demoData = {
    categories: [
        { id: '1', name: 'UX' },
        { id: '2', name: 'Work' },
        { id: '3', name: 'Design' },
        { id: '4', name: 'Creativity' },
        { id: '5', name: 'Brainstorm' },
        { id: '6', name: 'Weekly' },
    ],
    members: [
        { id: '1', name: 'Jessie', avatar: '/api/placeholder/40/40', isSelected: true },
        { id: '2', name: 'Mike', avatar: '/api/placeholder/40/40' },
        { id: '3', name: 'Jan', avatar: '/api/placeholder/40/40' },
        { id: '4', name: 'Nicole', avatar: '/api/placeholder/40/40' },
    ],
};

export default function MeetingDetailsPage() {
    const handleStart = () => {
        redirect('/meeting/chat');
    };

    return (
        <div className="min-h-screen bg-[#3C3C5D]">
            <MeetingDetails
                title="Discussing UX Patterns"
                categories={demoData.categories}
                members={demoData.members}
                dateTime="July 12, 2022 / 14:00"
                onStart={handleStart}
            />
        </div>
    );
}