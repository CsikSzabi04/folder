import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Paper, Fade } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../../firebaseConfig';

export default function Login({ auth, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function login() {
    if (!email || !password) {
      setLoginError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setLoginError('');
      navigate('/');
    } catch (error) {
      console.log("Login error: ", error.code);
      setLoginError(
        error.code === 'auth/invalid-credential' 
          ? 'Invalid email or password' 
          : 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') login();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Form Section */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 3, md: 6 },
            backgroundColor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 4,
              textAlign: 'center',
            }}
          >
            Welcome Back
          </Typography>
          
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
            error={!!loginError}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            error={!!loginError}
            sx={{ mb: 2 }}
          />
          
          {loginError && (
            <Fade in={!!loginError}>
              <Typography color="error" sx={{ mb: 2 }}>
                {loginError}
              </Typography>
            </Fade>
          )}
          
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={login}
            disabled={isLoading}
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link
                to="/signup"
                style={{
                  color: '#1976d2',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
        
        {/* Image Section */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            backgroundImage: 'url(https://source.unsplash.com/random/800x600/?inspiration,motivation)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(25, 118, 210, 0.3)',
            },
          }}
        />
      </Box>
    </Box>
  );
}