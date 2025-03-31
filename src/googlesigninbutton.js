import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from './firebase/auth';
import { useTheme } from '@mui/material/styles';

function GoogleSignInButton({ onSuccess }) {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/questionnaire');
            }
        } catch (error) {
            console.error('Google sign in error:', error);
        }
    };

    return (
        <Button 
            variant="contained"
            fullWidth
            onClick={handleGoogleSignIn}
            sx={{
                backgroundColor: '#ffffff',
                color: '#5f6368',
                textTransform: 'none',
                fontSize: '1.1rem',
                fontFamily: theme.typography.fontFamily,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                padding: '12px 20px',
                borderRadius: '10px',
                border: '1px solid #dadce0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                    backgroundColor: '#f8f9fa',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
            }}
        >
            <Box
                component="img"
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                sx={{ 
                    width: 24, 
                    height: 24,
                    objectFit: 'contain'
                }}
            />
            <Typography 
                component="span" 
                sx={{ 
                    fontWeight: 500,
                    letterSpacing: '0.25px'
                }}
            >
                Continue with Google
            </Typography>
        </Button>
    );
}

export default GoogleSignInButton;
