"use client";

import { Meeting } from "@/lib/API";
import { Paper, Typography, Stack, Chip } from "@mui/material";
import Link from "next/link";
import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { useState, useEffect } from "react";

interface MeetingCardProps {
  meeting: Meeting;
}

interface MeetingTag {
  meetingId: string;
  tenantId: string;
  tagId: string;
}

interface Tag {
  color: string;
  name: string;
}

interface TagWithDetails extends Tag {
  id: string;
}

export default function MeetingCard(props: MeetingCardProps) {
  const [tags, setTags] = useState<TagWithDetails[]>([]);

  const getMeetingTags = async (
    meetingId: string
  ): Promise<TagWithDetails[]> => {
    const db = getDatabase();

    try {
        console.log("meetingId: ", meetingId);
      // 1. Query meetingTags to get all entries for this meetingId
      const meetingTagsRef = ref(db, "meetingTags");
      const meetingTagsQuery = query(
        meetingTagsRef,
        orderByChild("meetingId"),
        equalTo(meetingId)
      );


      const meetingTagsSnapshot = await get(meetingTagsQuery);

      if (!meetingTagsSnapshot.exists()) {
        console.log("No meeting tags found for meetingId:", meetingId);
        return [];
      }

      // 2. Get all tagIds from the meetingTags entries
      const tagPromises: any[] = [];
      const tagIds = new Set<string>();

      meetingTagsSnapshot.forEach((child: any) => {
        const meetingTag = child.val() as MeetingTag;
        if (meetingTag.tagId) {
          tagIds.add(meetingTag.tagId);
          // Get tag details for each tagId
          const tagRef = ref(db, `tags/${meetingTag.tagId}`);
          tagPromises.push(get(tagRef));
        }
      });

      // 3. Fetch all tag details in parallel
      const tagSnapshots = await Promise.all(tagPromises);

      // 4. Combine the data
      const tags: TagWithDetails[] = tagSnapshots
        .filter((snapshot) => snapshot.exists())
        .map((snapshot) => ({
          id: snapshot.key as string,
          ...(snapshot.val() as Tag),
        }));

      return tags;
    } catch (error) {
      console.error("Error fetching meeting tags:", error);
      throw error;
    }
  };

  const loadTags = async () => {
    try {
      const tags = await getMeetingTags(props.meeting.id);
      setTags(tags);
    } catch (error) {
      console.error("Error loading tags: ", error);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  return (
    <Link
      href={`/transcriptions/${props.meeting.id}`}
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
