"use client";
import { Box, Typography } from '@mui/material';

interface Step {
    number: number;
    text: string;
    active?: boolean;
}

const Step = ({ number, text, active = false }: Step) => (
    <Box
        className={`flex items-center p-4 rounded-lg mb-3 transition-all
      ${active ? 'bg-white' : 'bg-gray-800 hover:bg-gray-700'}`}
    >
        <Box
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
        ${active ? 'bg-black text-white' : 'bg-gray-700 text-gray-300'}`}
        >
            {number}
        </Box>
        <Typography className={active ? 'text-black' : 'text-gray-300'}>
            {text}
        </Typography>
    </Box>
);

export const OnboardingSteps = () => (
    <Box className="w-full max-w-md mx-auto">
        <Box className="mb-8">
            <Typography variant="h3" className="text-white text-4xl font-bold mb-4">
                Get Started with Us
            </Typography>
            <Typography className="text-gray-400">
                Complete these easy steps to register your account.
            </Typography>
        </Box>

        <Box className="mt-12">
            <Step number={1} text="Sign up your account" active />
            <Step number={2} text="Set up your workspace" />
            <Step number={3} text="Set up your profile" />
        </Box>
    </Box>
);