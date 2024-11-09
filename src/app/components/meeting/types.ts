"use client";

export interface Member {
    id: string;
    name: string;
    avatar: string;
    isSelected?: boolean;
}

export interface Category {
    id: string;
    name: string;
}

export interface Message {
    id: string;
    member: Member;
    text: string;
}

export interface MeetingDetailsProps {
    title: string;
    categories: Category[];
    members: Member[];
    dateTime: string;
    onStart: () => void;
}

export interface MeetingChatProps {
    title: string;
    messages: Message[];
    participants: Member[];
}