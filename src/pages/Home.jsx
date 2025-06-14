import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

const FuturisticContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'radial-gradient(circle at center, #0f0c29, #302b63, #24243e)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  color: '#e6f7ff',
  padding: theme.spacing(4),
  fontFamily: `'Orbitron', sans-serif`,
}));

const GlassCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '16px',
  padding: theme.spacing(5),
  maxWidth: 600,
  width: '100%',
  backdropFilter: 'blur(10px)',
 
  border: '1px solid rgba(255, 255, 255, 0.15)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  
  },
}));

const NeonButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  borderRadius: '12px',
  color: '#fff',
  backgroundColor: '#516066',
  boxShadow: '0 0 12pxrgb(26, 41, 41)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#3f4d53',
    
    transform: 'scale(1.05)',
  },
}));

export default function Home() {
  return (
    <FuturisticContainer>
      <GlassCard>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome to Your Vision Board
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Visualize your goals. Connect your ideas. Design your future.
        </Typography>
        <NeonButton
          component={Link}
          to="/vision-board"
          variant="contained"
          size="large"
        >
          Start Creating
        </NeonButton>
      </GlassCard>
    </FuturisticContainer>
  );
}
