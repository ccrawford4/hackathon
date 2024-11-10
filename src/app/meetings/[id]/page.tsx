"use client";

import { Avatar, AvatarGroup, Button, Chip, IconButton } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { CustomUser, Meeting, TagWithDetails } from "@/lib/API";
import { getItem } from "@/lib/queries";
import { useDatabase } from "@/app/providers/AppContext";
import { getMeetingTags, getMeetingUsers } from "@/lib/helpers";
import Link from "next/link";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { deleteObject, updateObject } from "@/lib/mutations";

export default function MeetingDetail() {
  const params = useParams();
  const db = useDatabase();
  const id = params.id;
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [tags, setTags] = useState<TagWithDetails[]>([]);
  const [users, setUsers] = useState<CustomUser[]>([]);
  const router = useRouter();
  const [isMeetingOver, setIsMeetingOver] = useState(meeting?.data.endAt);

  const onStart = () => {
    updateObject(db, "meetings", id as string, {
      startAt: new Date().toISOString(),
    })
    router.push(`/meetings/${id}/start`);
  };

  const loadMeetingDetails = useCallback(async () => {
    const meeting = await getItem(db, "meetings", id as string);
    const tags = await getMeetingTags(db, meeting.id);
    const users = await getMeetingUsers(db, meeting.id);
    setIsMeetingOver((meeting.data as Meeting["data"]).endAt);

    setMeeting(meeting as Meeting);
    setTags(tags as TagWithDetails[]);
    setUsers(users as CustomUser[]);
  }, [db, id]);

  useEffect(() => {
    loadMeetingDetails();
  }, [loadMeetingDetails]);

  useEffect(() => {
    console.log("USERS: ", users);
  }, [users]);

  const handleDeleteMeeting = () => {
    deleteObject(db, "meetings", id as string);
    router.push("/meetings");
  };

  return (
    <div className="text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <Link href="/meetings">
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <h1 className="text-xl">
          {isMeetingOver ? "Meeting Summary" : "Meeting Details"}
        </h1>
        <div className="justify-end">
          <IconButton color="inherit" onClick={handleDeleteMeeting}>
            <Delete />
          </IconButton>
          <IconButton color="inherit">
            <Edit />
          </IconButton>
        </div>
      </div>

      {meeting?.data.endAt ? (
        // Meeting Summary View
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold">{meeting?.data.title}</h2>
            {meeting?.data.startAt && (
              <>
              <p className="text-gray-400">
                Meeting Date:{" "}
                {new Date(meeting.data.startAt).toLocaleDateString()}
              </p>
               <p className="text-gray-400">
               Started: {" "}
               {new Date(meeting.data.startAt).toLocaleTimeString()}
             </p>
             </>
            )}
             <p className="text-gray-400">
              End Date: {new Date(meeting?.data.endAt).toDateString()}
            </p>
            <p className="text-gray-400">
              Ended: {new Date(meeting?.data.endAt).toLocaleTimeString()}
            </p>
          </div>

          <div>
            <p className="text-gray-400 mb-2">Summary</p>
            <p className="text-lg">{meeting?.data.summary}</p>
          </div>

          <div>
            <p className="text-gray-400 mb-2">Tagline:</p>
            <p className="list-disc list-inside space-y-1">
             {meeting?.data.tagLine ? meeting.data.tagLine : "No tagline available"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 mb-2">Transcript</p>
            <div className="bg-gray-900 p-4 rounded-lg max-h-64 overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">
                {meeting?.data.transcript && meeting.data.transcript.length > 0 ? (
                  meeting.data.transcript
                ): (
                  "No transcript available"
                )}
              </p>
            </div>
          </div>

          <div>
            <p className="text-gray-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
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
            </div>
          </div>
        </div>
      ) : (
        // Meeting in Progress View
        <div className="space-y-8">
          <div>
            <p className="text-gray-400 mb-2">Name</p>
            <h2 className="text-3xl font-bold">{meeting?.data.title}</h2>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Date & Time</p>
            <p className="text-xl">{new Date().toDateString()}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Invited members</p>
            <div className="flex items-center space-x-2">
              <AvatarGroup max={4}>
                {users.map((user, index) => (
                  <Avatar
                    key={index}
                    src={user.data.profileURL}
                    alt={`${user.data.firstName} ${user.data.lastName}`}
                    className={"ring-2 ring-[#7000FF]"}
                  />
                ))}
              </AvatarGroup>
            </div>
          </div>
          <Button
            variant="contained"
            fullWidth
            onClick={onStart}
            className="bg-purple-400 text-black hover:bg-gray-100 py-4 rounded-lg"
          >
            {meeting?.data.startAt ? "Resume": "Start" }
          </Button>
        </div>
      )}
    </div>
  );
}
