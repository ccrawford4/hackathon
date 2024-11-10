"use client";

import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import { Search, Settings, AccountCircle, Add } from "@mui/icons-material";
import RequireAuthToolBar from "../components/RequireAuthToolBar";
import { useCallback, useEffect, useState } from "react";
import { useAuth, useDatabase } from "../providers/AppContext";
import { listAll } from "@/lib/queries";
import { Meeting, QueryInput, Tag, CustomUser } from "@/lib/API";
import MeetingCard from "../components/MeetingCard";
import NewMeeting from "../components/NewMeeting";
import { createObject, createObjects, deleteObject } from "@/lib/mutations";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#121212",
    },
  },
});

export default function LandingPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [users, setUsers] = useState<CustomUser[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMeeting, setAddMeeting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<CustomUser[]>([]);
  const [meetingName, setMeetingName] = useState("");
  const [numMeetings, setNumMeetings] = useState(0);
  const database = useDatabase();
  const { tenantId } = useAuth();

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);

      // Load meetings
      const result = await listAll(database, "meetings", tenantId);
      if (!result) {
        console.error("No data found");
        setLoading(false);
        return;
      }
      console.log("RESULT: ", result);
      setMeetings(result.map((entry) => ({
        id: entry.id,
        data: entry.data as Meeting["data"],
      })));
      setNumMeetings(result.length);

      const usersResult = await listAll(database, "users", tenantId);
      if (!usersResult) {
        console.error("No users found");
        setLoading(false);
        return;
      }
      setUsers(usersResult.map((entry) => ({
        id: entry.id,
        data: entry.data as CustomUser["data"],
      })));

      const tags = await listAll(database, "tags", tenantId);
      if (!tags) {
        console.error("No tags found");
        setLoading(false);
        return;
      }
      setAvailableTags(tags.map((entry) => ({
        id: entry.id,
        data: entry.data as Tag["data"],
      })));

      console.log("Available tags: ", availableTags);
      setLoading(false);
    } catch (error) {
      console.error("Error loading page: ", error);
      setLoading(false);
    }
  }, [tenantId, database]);


  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const reset = () => {
    setMeetingName("");
    setSelectedUsers([]);
    setTags([]);
  }


  const handleCreateMeeting = async () => {
    const newMeeting: QueryInput = {
      data: {
        tenantId: tenantId as string,
        title: meetingName,
      },
    }

    const response = await createObject(database, "meetings", newMeeting);

    const newMeetingObject: Meeting = {
      id: response.id,
      data: response.data as Meeting["data"],
    }
    setMeetings((prevMeetings) => prevMeetings.concat(newMeetingObject));
    reset();

    const meetingUsers: QueryInput[] = selectedUsers.map((user) => ({
      data: {
        meetingId: response.id,
        userId: user.id,
        tenantId: tenantId as string,
      },
    }));

    const users = await createObjects(database, "meetingUsers", meetingUsers);
    if (!users) { 
      console.error("Error creating meeting users");
    }

    const meetingTags: QueryInput[] = tags.map((tag) => ({
      data: {
        meetingId: response.id,
        tagId: tag.id,
        tenantId: tenantId as string,
      },
    }));
    const meetingTagsResponse = await createObjects(database, "meetingTags", meetingTags);
    console.log("Meeting tags response: ", meetingTagsResponse);
    if (!meetingTagsResponse) {
      console.error("Error creating meeting tags");
    }

    setNumMeetings(numMeetings + 1);
    setAddMeeting(false);
  }

  const handleDeleteMeeting = (meetingId: string) => {
    deleteObject(database, "meetings", meetingId);
    setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== meetingId));
    setNumMeetings(numMeetings - 1);
  }


  // TODO: Change to use a react spinner instead
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <RequireAuthToolBar>
     <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{ flexGrow: 1, minHeight: "100vh", pb: 10, position: "relative" }}
        >
          <AppBar
            position="static"
            elevation={0}
            sx={{ backgroundColor: "background.paper" }}
          >
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Meetings
              </Typography>
              <IconButton
                onClick={() => setAddMeeting(!addMeeting)}
                color="inherit"
                size="large"
              >
                <Add />
              </IconButton>
              <IconButton color="inherit" size="large">
                <Search />
              </IconButton>
              <IconButton color="inherit" size="large">
                <Settings />
              </IconButton>
              <IconButton color="inherit" size="large">
                <AccountCircle />
              </IconButton>
            </Toolbar>
          </AppBar>

          <NewMeeting 
            addMeeting={addMeeting}
            setAddMeeting={setAddMeeting}
            users={users}
            tags={tags}
            setTags={setTags}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            meetingName={meetingName}
            setMeetingName={setMeetingName}
            availableTags={availableTags}
            handleCreateMeeting={handleCreateMeeting}
          />

          <Box sx={{ p: 2 }}>
            {meetings.map((meeting) => (
              <MeetingCard 
                key={meeting.id} 
                meeting={meeting} 
                numMeetings={numMeetings}
                 deleteMeeting={handleDeleteMeeting}
              />
            ))}
          </Box>
        </Box>
      </ThemeProvider>
    </RequireAuthToolBar>
  );
}
