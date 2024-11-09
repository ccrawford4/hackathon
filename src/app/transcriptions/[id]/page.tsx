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

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#121212',
        },
    },
});

interface TranscriptionDetail {
    id: number;
    title: string;
    tag: string;
    content: string;
}

export default function TranscriptionDetail() {
    const params = useParams();
    const id = params.id;

    // Sample data - replace with actual data fetching
    const transcription: TranscriptionDetail = {
        id: Number(id),
        title: "Hackathon",
        tag: "Tag 1",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Phasellus vel iaculis ligula, vel laoreet enim. Mauris vitae augue porttitor, 
    sollicitudin ipsum in, facilisis quam. Pellentesque elementum pretium lacus, 
    vel porta nunc semper in. Sed vel nulla in ligula aliquet tristique sit amet et dolor. 
    Donec sed congue elit, nec feugiat arcu. Maecenas est augue, ultricies eu pellentesque vel, 
    aliquet quis est.`
    };

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
                        {transcription.title}
                    </Typography>

                    <Chip
                        label={transcription.tag}
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            mb: 3
                        }}
                    />

                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6,
                            letterSpacing: '0.00938em',
                        }}
                    >
                        {transcription.content}
                    </Typography>
                </Container>
            </Box>
        </ThemeProvider>
    );
}