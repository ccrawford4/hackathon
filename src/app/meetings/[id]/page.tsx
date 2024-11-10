"use client";

import { Avatar, AvatarGroup, Button, IconButton } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { CustomUser, Meeting, Tag } from "@/lib/API";
import { getItem, getTenant, listAll } from "@/lib/queries";
import { useDatabase, useTenantId } from "@/app/providers/AppContext";
import { getMeetingTags, getMeetingUsers } from "@/lib/helpers";
import Link from "next/link";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { deleteObject } from "@/lib/mutations";
import EditMeeting from "@/app/components/EditMeeting";

export default function MeetingDetail() {
  const params = useParams();
  const db = useDatabase();
  const id = params.id;
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [users, setUsers] = useState<CustomUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<CustomUser[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [meetingName, setMeetingName] = useState("");
  const [openEditForm, setOpenEditForm] = useState(false);
  const router = useRouter();
  const tenant = useTenantId();

  const onStart = () => {
    router.push(`/meetings/${id}/start`);
  };

  const loadMeetingDetails = useCallback(async () => {
    const meeting = await getItem(db, "meetings", id as string);
    const tags = await getMeetingTags(db, meeting.id);
    const allTags = await listAll(db, "tags", tenant);
    const users = await getMeetingUsers(db, meeting.id);

    setAvailableTags(allTags as Tag[]);
    setMeeting(meeting as Meeting);
    setMeetingName((meeting.data as Meeting["data"]).title);
    setTags(tags);
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
        <h1 className="text-xl">Meeting details</h1>
        <div className="justify-end">
          <IconButton color="inherit" onClick={handleDeleteMeeting}>
            <Delete />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => setOpenEditForm(!openEditForm)}
          >
            <Edit />
          </IconButton>
        </div>
      </div>

      <EditMeeting
        db={db}
        meetingTitle={meeting?.data.title as string}
        meetingId={id as string}
        availableTags={availableTags}
        setMeetingName={setMeetingName}
        setTags={setTags}
        tags={tags}
        open={openEditForm}
        onClose={() => setOpenEditForm(false)}
        users={users}
        availableUsers={availableUsers}
      />

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
              {users.map((user, index) => {
                return (
                  <Avatar
                    key={index}
                    src={user.data.profileURL}
                    alt={user.data.firstName + " " + user.data.lastName}
                    className={"ring-2 ring-[#7000FF]"}
                  />
                );
              })}
            </AvatarGroup>
          </div>
        </div>
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
}
