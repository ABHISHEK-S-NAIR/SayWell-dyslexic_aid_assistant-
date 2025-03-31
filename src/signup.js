import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from './firebase/auth';
import GoogleSignInButton from './googlesigninbutton';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Divider, 
  Box, 
  Alert,
  InputAdornment,
  IconButton,
  Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AllContext from './AllContext';

function Signup() {
  const { firstName, setFirstName, lastName, setLastName, email, setEmail, setUserId } = useContext(AllContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (password !== confirmPassword) {
      showMessage("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      await signUp(setUserId, email, password, firstName, lastName);
      showMessage('Account Created Successfully', 'success');
      setTimeout(() => {
        navigate('/questionnaire');
      }, 1500);
    } catch (error) {
      showMessage(error.message);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            Create Account
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: theme.palette.text.secondary,
              mb: 3
            }}
          >
            Join SayWell and start your learning journey
          </Typography>
        </Box>

        {message.text && (
          <Alert 
            severity={message.type === 'success' ? 'success' : 'error'} 
            sx={{ 
              mb: 3,
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            {message.text}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <GoogleSignInButton onSuccess={() => navigate('/')} />
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              px: 1
            }}
          >
            or sign up with email
          </Typography>
        </Divider>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="First Name" 
                margin="normal" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: '1.1rem'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Last Name" 
                margin="normal" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: '1.1rem'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <TextField 
            fullWidth 
            label="Email" 
            margin="normal" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            sx={{ 
              mb: 2,
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
            margin="normal" 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength={6} 
            sx={{ 
              mb: 2,
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

          <TextField 
            fullWidth 
            label="Confirm Password" 
            margin="normal" 
            type={showConfirmPassword ? 'text' : 'password'} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            minLength={6} 
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
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ 
              mt: 2,
              mb: 3,
              py: 1.5,
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Sign Up
          </Button>
        </form>

        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center',
            fontSize: '1.05rem'
          }}
        >
          Already have an account?{' '}
          <Link 
            to="/login" 
            style={{ 
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Signup;
