import React from 'react';
import { Typography, Box } from '@mui/material';

export default function Goals() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Goals
      </Typography>
      <Typography variant="body1">
        This is where you can track your long-term goals and objectives.
      </Typography>
    </Box>
  );
}