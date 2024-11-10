"use client";

import { Meeting, TagWithDetails } from "@/lib/API";
import { getMeetingTags } from "@/lib/helpers";
import { Paper, Typography, Stack, Chip } from "@mui/material";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useDatabase } from "../providers/AppContext";
import { format, isPast, isFuture, isAfter } from 'date-fns';

interface MeetingCardProps {
  meeting: Meeting;
  numMeetings: number;
}

export default function MeetingCard(props: MeetingCardProps) {
  const { meeting, numMeetings } = props;
  const [tags, setTags] = useState<TagWithDetails[]>([]);
  const db = useDatabase();

  const loadTags = useCallback(async () => {
    try {
      console.log("Meeting Id: ", props.meeting.id);
      const tags = await getMeetingTags(db, props.meeting.id);

      console.log("Tags: ", tags);
      setTags(tags);
    } catch (error) {
      console.error("Error loading tags: ", error);
    }
  }, [db, props.meeting.id]); // Include dependencies used inside loadTags

  useEffect(() => {
    loadTags();
  }, [loadTags, numMeetings]); // Add loadTags as a dependency to useEffect

  const getMeetingStatus = () => {
    const now = new Date();
    const startAt = new Date(meeting.data.startAt as string);
    const endAt = new Date(meeting.data.endAt as string);

    if (isFuture(startAt)) {
      return {
        label: 'Not Started',
        color: 'bg-blue-500/10 text-blue-500',
        dotColor: 'bg-blue-500'
      };
    } else if (isPast(endAt)) {
      return {
        label: 'Ended',
        color: 'bg-gray-500/10 text-gray-500',
        dotColor: 'bg-gray-500'
      };
    } else {
      return {
        label: 'In Progress',
        color: 'bg-green-500/10 text-green-500',
        dotColor: 'bg-green-500'
      };
    }
  };

  const status = getMeetingStatus();

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="block no-underline text-inherit transition-all duration-200"
    >
      <Paper
        elevation={0}
        className="mb-3 p-6 border-b border-divider hover:bg-white/[0.02] transition-all duration-200"
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 0,
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <Typography variant="h5" className="font-medium">
            {meeting.data.title}
          </Typography>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.color}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${status.dotColor} animate-pulse`}
            />
            <span className="text-sm font-medium">{status.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {format(new Date(meeting.data.startAt as string), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{format(new Date(meeting.data.startAt as string), "HH:mm")}</span>
          </div>
        </div>

        <Stack direction="row" spacing={1} className="flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag.name}
              className="rounded-full font-medium"
              sx={{
                backgroundColor: tag.color || "rgba(255, 255, 255, 0.1)",
                color: "white",
                "& .MuiChip-label": {
                  fontWeight: 500,
                },
              }}
            />
          ))}
        </Stack>
      </Paper>
    </Link>
  );
}
