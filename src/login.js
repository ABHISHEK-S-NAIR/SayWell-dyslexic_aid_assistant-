import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from './firebase/auth';
import GoogleSignInButton from './googlesigninbutton';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Divider, 
  Box,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signIn(email, password);
      showMessage('Login successful!', 'success');
      setTimeout(() => {
        navigate('/app');
      }, 1500);
    } catch (error) {
      showMessage(error.message);
    }
  };

  const handleGoogleSuccess = () => {
    showMessage('Login successful!', 'success');
    setTimeout(() => {
      navigate('/app');
    }, 1500);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '80vh'
    }}>
      <Paper 
        elevation={6} 
        sx={{ 
          p: 5, 
          width: '100%', 
          bgcolor: theme.palette.background.paper,
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 1, 
              fontFamily: theme.typography.fontFamily,
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: theme.palette.text.secondary,
              mb: 3
            }}
          >
            Log in to continue your learning journey
          </Typography>
        </Box>

        {message.text && 
          <Alert 
            severity={message.type} 
            sx={{ 
              mb: 3,
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            {message.text}
          </Alert>
        }

        <Box sx={{ mb: 3 }}>
          <GoogleSignInButton onSuccess={handleGoogleSuccess} />
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              px: 1
            }}
          >
            or login with email
          </Typography>
        </Divider>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: '1.1rem'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: '1.1rem'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            type="submit" 
            sx={{ 
              mb: 3,
              py: 1.5,
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Login
          </Button>
        </form>
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center',
            fontSize: '1.05rem'
          }}
        >
          Don't have an account?{' '}
          <Link 
            to="/" 
            style={{ 
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;