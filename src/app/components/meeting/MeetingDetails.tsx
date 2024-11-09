"use client";
import React from 'react';
import { IconButton, Button, Avatar, AvatarGroup } from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import Link from 'next/link';
import { Member, Category } from './types';

interface MeetingDetailsProps {
    title: string;
    categories: Category[];
    members: Member[];
    dateTime: string;
    onStart: () => void;
}

const MeetingDetails: React.FC<MeetingDetailsProps> = ({
    title,
    // categories,
    members,
    dateTime,
    onStart,
}) => {
    return (
        <div className="text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <Link href="/">
                    <IconButton color="inherit">
                        <ArrowBack />
                    </IconButton>
                </Link>
                <h1 className="text-xl">Meeting details</h1>
                <IconButton color="inherit">
                    <Edit />
                </IconButton>
            </div>

            <div className="space-y-8">
                <div>
                    <p className="text-gray-400 mb-2">Name</p>
                    <h2 className="text-3xl font-bold">{title}</h2>
                </div>

                {/* <div>
                    <p className="text-gray-400 mb-2">Categories</p>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <span
                                key={category.id}
                                className="px-4 py-2 rounded-full bg-[#4B4B6A]"
                            >
                                {category.name}
                            </span>
                        ))}
                        <button className="w-10 h-10 rounded-full bg-[#7000FF] flex items-center justify-center">
                            +
                        </button>
                    </div>
                </div> */}

                <div>
                    <p className="text-gray-400 mb-2">Date & Time</p>
                    <p className="text-xl">{dateTime}</p>
                </div>

                <div>
                    <p className="text-gray-400 mb-2">Invited members</p>
                    <div className="flex items-center space-x-2">
                        <AvatarGroup max={4}>
                            {members.map((member) => (
                                <Avatar
                                    key={member.id}
                                    src={member.avatar}
                                    alt={member.name}
                                    className={member.isSelected ? "ring-2 ring-[#7000FF]" : ""}
                                />
                            ))}
                        </AvatarGroup>
                    </div>
                </div>

                {/* <div className="flex items-center space-x-2 py-4">
                    <input
                        type="checkbox"
                        checked
                        className="rounded-sm bg-[#7000FF]"
                        readOnly
                    />
                    <span>Private conference</span>
                </div> */}

                <Button
                    variant="contained"
                    fullWidth
                    onClick={onStart}
                    className="bg-white text-black hover:bg-gray-100 py-4 rounded-lg"
                >
                    Start
                </Button>
            </div>
        </div>
    );
};

export default MeetingDetails;