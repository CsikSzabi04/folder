import React from 'react';
import { Typography, Box } from '@mui/material';

export default function Inspiration() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inspiration Gallery
      </Typography>
      <Typography variant="body1">
        Collect and organize your inspiration here.
      </Typography>
    </Box>
  );
}