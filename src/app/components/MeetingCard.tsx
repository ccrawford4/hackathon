"use client";

import { Meeting, TagWithDetails } from "@/lib/API";
import { getMeetingTags } from "@/lib/helpers";
import { Paper, Typography, Stack, Chip } from "@mui/material";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useDatabase } from "../providers/AppContext";
import { Delete } from "@mui/icons-material";

interface MeetingCardProps {
  meeting: Meeting;
  numMeetings: number;
  deleteMeeting: (meetingId: string) => void;
}

export default function MeetingCard(props: MeetingCardProps) {
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
  }, [loadTags, props.numMeetings]); // Add loadTags as a dependency to useEffect

  return (
    <Link
      href={`/meetings/${props.meeting.id}`}
      key={props.meeting.id}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          borderRadius: 0,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        }}
      >
        {/* Stack for layout with title and delete icon spaced apart */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom>
            {props.meeting.data.title}
          </Typography>
          <Delete sx={{ cursor: "pointer" }} onClick={props.deleteMeeting}/>
        </Stack>
  
        {/* Stack for horizontal tag layout with wrapping */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            gap: 1, // Gap between wrapped rows
          }}
        >
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag.name}
              sx={{
                backgroundColor: tag.color || "rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
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
