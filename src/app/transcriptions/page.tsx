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
    Stack
} from '@mui/material';

import {
    Search,
    Settings,
    AccountCircle,
} from '@mui/icons-material';
import Link from 'next/link';
import RequireAuthToolBar from '../components/RequireAuthToolBar';

const darkTheme = createTheme(
    {
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#121212',
            },
        },
    });

interface Transcription {
    id: number;
    title: string;
    tags: {
        id: number;
        name: string;
        color?: string;
    }[];
    preview?: string;
}

export default function LandingPage() {
    const transcriptions: Transcription[] = [
        {
            id: 1,
            title: 'Hackathon',
            tags: [
                { id: 1, name: "Hackathon", color: "#4A90E2" },
                { id: 2, name: "Programming", color: "#50E3C2" },
                { id: 3, name: "Coding" }
            ]
        },
        {
            id: 2,
            title: 'Workshop',
            tags: [
                { id: 4, name: "Workshop" },
                { id: 2, name: "Programming", color: "#50E3C2" },
                { id: 3, name: "Coding" }
            ]
        },
        {
            id: 3,
            title: 'Webinar',
            tags: [
                { id: 5, name: "Webinar" },
                { id: 2, name: "Programming", color: "#50E3C2" },
                { id: 3, name: "Coding" }
            ]
        },
        {
            id: 4,
            title: 'Conference',
            tags: [
                { id: 6, name: "Conference" },
                { id: 2, name: "Programming", color: "#50E3C2" },
                { id: 3, name: "Coding" }
            ]
        },
    ];
    return (
        <RequireAuthToolBar>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 10, position: 'relative' }}>
                <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Transcriptions
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
                    {transcriptions.map((transcription) => (
                        <Link
                            href={`/transcriptions/${transcription.id}`}
                            key={transcription.id}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    p: 2,
                                    backgroundColor: 'background.paper',
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    borderRadius: 0,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                    }
                                }}
                            >
                                <Typography variant="h5" gutterBottom>
                                    {transcription.title}
                                </Typography>

                                {/* Stack for horizontal tag layout with wrapping */}
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        flexWrap: 'wrap',
                                        gap: 1 // Gap between wrapped rows
                                    }}
                                >
                                    {transcription.tags.map((tag) => (
                                        <Chip
                                            key={tag.id}
                                            label={tag.name}
                                            sx={{
                                                backgroundColor: tag.color || 'rgba(255, 255, 255, 0.1)',
                                                borderRadius: '16px',
                                                color: 'white',
                                                '& .MuiChip-label': {
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Paper>
                        </Link>
                    ))}
                </Box>
            </Box>
        </ThemeProvider>
    </RequireAuthToolBar>
    );
}