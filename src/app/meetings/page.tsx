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
    Autocomplete,
    TextField,
    alpha
} from '@mui/material';

import {
    Search as SearchIcon,
    Settings,
    AccountCircle,
} from '@mui/icons-material';
import Link from 'next/link';
import RequireAuthToolBar from '../components/RequireAuthToolBar';
import { useState, useMemo } from 'react';

const darkTheme = createTheme({
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
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const transcriptions = useMemo<Transcription[]>(() => [
        {
            id: 1,
            title: 'Hackathon',
            tags: [
                { id: 1, name: "Hackathon"},
                { id: 2, name: "Programming"},
                { id: 3, name: "Coding" }
            ]
        },
        {
            id: 2,
            title: 'Workshop',
            tags: [
                { id: 4, name: "Workshop" },
                { id: 2, name: "Programming"},
                { id: 3, name: "Coding" }
            ]
        },
        {
            id: 3,
            title: 'Webinar',
            tags: [
                { id: 5, name: "Webinar" },
                { id: 2, name: "Programming"},
                { id: 3, name: "Coding" }
            ]
        },
        {
            id: 4,
            title: 'Conference',
            tags: [
                { id: 6, name: "Conference" },
                { id: 2, name: "Programming"},
                { id: 3, name: "Coding" }
            ]
        },
        {
            id: 5,
            title: 'Job search',
            tags: [
                { id: 7, name: "LinkedIn" },
                { id: 8, name: "Github"},
                { id: 9, name: "Resume" }
            ]
        },
        {
            id: 6,
            title: 'Professional development',
            tags: [
                { id: 10, name: "Progress" },
                { id: 11, name: "Finishing"},
                { id: 12, name: "Soul Searching" }
            ]
        },
    ], []);

    const searchOptions = useMemo(() => {
        const options = new Set<string>();

        transcriptions.forEach(transcription => {
            options.add(transcription.title);
            transcription.tags.forEach(tag => options.add(tag.name));
        });

        return Array.from(options);
    }, [transcriptions]);

    const filteredTranscriptions = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return transcriptions;

        return transcriptions.filter(transcription => {
            if (transcription.title.toLowerCase().includes(query)) {
                return true;
            }
            return transcription.tags.some(tag =>
                tag.name.toLowerCase().includes(query)
            );
        });
    }, [searchQuery, transcriptions]);

    return (
        <RequireAuthToolBar>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 10, position: 'relative' }}>
                    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
                        <Toolbar>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    flexGrow: 1,
                                    display: isSearchOpen ? 'none' : 'block'
                                }}
                            >
                                Transcriptions
                            </Typography>

                            <Box
                                sx={{
                                    position: 'relative',
                                    flexGrow: isSearchOpen ? 1 : 0,
                                    display: 'flex',
                                    borderRadius: 1,
                                    mr: 2,
                                    ml: 0,
                                    width: isSearchOpen ? 'auto' : '0%',
                                }}
                            >
                                {isSearchOpen && (
                                    <Autocomplete
                                        sx={{
                                            width: '100%',
                                            '& .MuiAutocomplete-inputRoot': {
                                                color: 'inherit',
                                                bgcolor: (theme) => alpha(theme.palette.common.white, 0.15),
                                                '&:hover': {
                                                    bgcolor: (theme) => alpha(theme.palette.common.white, 0.25),
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none'
                                                }
                                            }
                                        }}
                                        freeSolo
                                        options={searchOptions}
                                        inputValue={searchQuery}
                                        onInputChange={(_, newValue) => {
                                            setSearchQuery(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Search transcriptions..."
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                        ListboxProps={{
                                            sx: { bgcolor: 'background.paper' }
                                        }}
                                    />
                                )}
                            </Box>

                            <IconButton
                                color="inherit"
                                size="large"
                                onClick={() => {
                                    setIsSearchOpen(!isSearchOpen);
                                    if (!isSearchOpen) {
                                        setSearchQuery('');
                                    }
                                }}
                            >
                                <SearchIcon />
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
                        {filteredTranscriptions.length === 0 ? (
                            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                                No transcriptions found
                            </Typography>
                        ) : (
                            filteredTranscriptions.map((transcription) => (
                                <Link
                                    href={`/meetings/${transcription.id}`}
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

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{
                                                flexWrap: 'wrap',
                                                gap: 1
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
                            ))
                        )}
                    </Box>
                </Box>
            </ThemeProvider>
        </RequireAuthToolBar>
    );
}