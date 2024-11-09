"use client";

import { Meeting, TagWithDetails } from "@/lib/API";
import { getMeetingTags } from "@/lib/helpers";
import { Paper, Typography, Stack, Chip } from "@mui/material";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useDatabase } from "../providers/AppContext";

interface MeetingCardProps {
  meeting: Meeting;
}

export default function MeetingCard(props: MeetingCardProps) {
  const [tags, setTags] = useState<TagWithDetails[]>([]);
  const db = useDatabase();

  const loadTags = useCallback(async () => {
    try {
      const tags = await getMeetingTags(db, props.meeting.id);
      setTags(tags);
    } catch (error) {
      console.error("Error loading tags: ", error);
    }
  }, [db, props.meeting.id]); // Include dependencies used inside loadTags

  useEffect(() => {
    loadTags();
  }, [loadTags]); // Add loadTags as a dependency to useEffect

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
        <Typography variant="h5" gutterBottom>
          {props.meeting.data.title}
        </Typography>

        {/* Stack for horizontal tag layout with wrapping */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            gap: 1, // Gap between wrapped rows
          }}
        >
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.data.name}
              sx={{
                backgroundColor: tag.data.color || "rgba(255, 255, 255, 0.1)",
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