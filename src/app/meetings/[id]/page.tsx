"use client";

import {
    AppBar,
    Box,
    CssBaseline,
    IconButton,
    Typography,
    Chip,
    ThemeProvider,
    createTheme,
    Container,
    Toolbar
} from '@mui/material';
import {
    Search,
    Settings,
    AccountCircle,
} from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Meeting, TagWithDetails } from '@/lib/API';
import { getItem } from '@/lib/queries';
import { useDatabase } from '@/app/providers/AppContext';
import { getMeetingTags } from '@/lib/helpers';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#121212',
        },
    },
});

export default function MeetingDetail() {
    const params = useParams();
    const db = useDatabase();
    const id = params.id;
   const [meeting, setMeeting] = useState<Meeting | null>(null);
   const [tags, setTags] = useState<TagWithDetails[]>([]);

    const loadMeetingDetails = useCallback(async () => {
        const meeting = await getItem(db, 'meetings', id as string);
        const tags = await getMeetingTags(db, meeting.id);
        setMeeting(meeting as Meeting);
        setTags(tags as TagWithDetails[]);
    }, [db, id]);

    useEffect(() => {
        loadMeetingDetails();
    }, [loadMeetingDetails]);


    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 10, position: 'relative' }}>
                <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
                    <Toolbar sx={{ justifyContent: 'flex-end' }}>
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

                <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        {meeting?.data.title}
                    </Typography>

                    {tags.map((tag) => {
                        return (
                            <Chip
                                key={tag.id}
                                label={tag.data.name}
                                sx={{
                                    backgroundColor: tag.data.color,
                                    borderRadius: '16px',
                                    mr: 1,
                                    mb: 1
                                }}
                            />
                        );
                    })}

                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6,
                            letterSpacing: '0.00938em',
                        }}
                    >
                        {meeting?.data.summary}
                    </Typography>
                </Container>
            </Box>
        </ThemeProvider>
    );
}