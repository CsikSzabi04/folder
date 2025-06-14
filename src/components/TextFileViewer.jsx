import React from 'react';
import { Box, Typography, IconButton, Paper, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ViewerContainer = styled(Paper)(({ theme }) => ({
  width: '80%',
  height: '80%',
  padding: theme.spacing(4),
  position: 'relative',
  background: 'rgba(23, 23, 66, 0.9)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(100, 200, 255, 0.2)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  overflowY: 'auto',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  
}));

export default function TextFileViewer({ textFile, onClose, onDelete }) {
  return (
    <ViewerContainer elevation={3}>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      
      <Typography variant="h4" gutterBottom sx={{ 
        color: '#ffffff',
        mb: 3,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 2
      }}>
        {textFile.title}
      </Typography>
      
      <Typography variant="body1" sx={{ 
        color: 'rgba(255, 255, 255, 0.9)',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.8'
      }}>
        {textFile.content}
      </Typography>
    </ViewerContainer>
  );
}