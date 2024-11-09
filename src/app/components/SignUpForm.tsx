"use client";

import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Google, GitHub } from '@mui/icons-material';
import Link from 'next/link';

export const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Box className="w-full max-w-md mx-auto">
            <Typography variant="h4" className="text-white font-bold mb-2">
                Sign Up Account
            </Typography>
            <Typography className="text-gray-400 mb-8">
                Enter your personal data to create your account.
            </Typography>

            {/* OAuth Buttons */}
            <Box className="grid grid-cols-2 gap-4 mb-8">
                <Button
                    variant="outlined"
                    startIcon={<Google />}
                    className="text-white border-gray-600 hover:bg-gray-800"
                    fullWidth
                >
                    Google
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<GitHub />}
                    className="text-white border-gray-600 hover:bg-gray-800"
                    fullWidth
                >
                    Github
                </Button>
            </Box>

            <Typography className="text-gray-400 text-center mb-8">Or</Typography>

            {/* Sign Up Form */}
            <Box className="space-y-6">
                <Box className="grid grid-cols-2 gap-4">
                    <TextField
                        name="firstName"
                        placeholder="eg. John"
                        label="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="bg-gray-800 rounded-lg"
                        fullWidth
                    />
                    <TextField
                        name="lastName"
                        placeholder="eg. Francisco"
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="bg-gray-800 rounded-lg"
                        fullWidth
                    />
                </Box>

                <TextField
                    name="email"
                    type="email"
                    placeholder="eg. johnfrans@gmail.com"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-800 rounded-lg"
                    fullWidth
                />

                <Box className="space-y-2">
                    <TextField
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-gray-800 rounded-lg"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Typography className="text-gray-400 text-sm">
                        Must be at least 8 characters.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    className="bg-white text-black hover:bg-gray-100 py-3 font-medium"
                    fullWidth
                >
                    Sign Up
                </Button>

                <Typography className="text-gray-400 text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-white hover:underline">
                        Log in
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};