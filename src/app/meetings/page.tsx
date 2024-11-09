"use client";

import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  Chip,
  ThemeProvider,
  createTheme,
  Stack,
} from "@mui/material";

import { Search, Settings, AccountCircle } from "@mui/icons-material";
import Link from "next/link";
import RequireAuthToolBar from "../components/RequireAuthToolBar";
import { useEffect, useState } from "react";
import { useDatabase } from "../providers/AppContext";
import { listAll } from "@/lib/queries";
import { Meeting } from "@/lib/API";
import MeetingCard from "../components/MeetingCard";

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
  const [loading, setLoading] = useState(true);
  const database = useDatabase();

  const loadPage = async () => {
    try {
      setLoading(true);

      const result = await listAll(database, "meetings");
      if (!result) {
        console.error("No data found");
        setLoading(false);
        return;
      }

      const newMeetings: Meeting[] = [];
      for (const entry of result) {
        newMeetings.push({
          id: entry.id,
          data: (entry.data as any),
        });
      }

      setMeetings(newMeetings);
      setLoading(false);
    } catch (error) {
      console.error("Error loading page: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

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

          <Box sx={{ p: 2 }}>
            {meetings.map((meeting) => (
             <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </Box>
        </Box>
      </ThemeProvider>
    </RequireAuthToolBar>
  );
}
