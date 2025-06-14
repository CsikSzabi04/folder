import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';

const ModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  padding: '24px',
});

export default function TextFileModal({ open, onClose, onSubmit }) {
  const [textData, setTextData] = useState({
    title: '',
    content: ''
  });

  const handleChange = (e) => {
    setTextData({
      ...textData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (textData.title && textData.content) {
      onSubmit(textData);
      setTextData({ title: '', content: '' });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <Typography variant="h6" gutterBottom>
          Create Text Note
        </Typography>
        <TextField
          name="title"
          label="Title"
          fullWidth
          margin="normal"
          value={textData.title}
          onChange={handleChange}
        />
        <TextField
          name="content"
          label="Content"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={textData.content}
          onChange={handleChange}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!textData.title || !textData.content}
          >
            Create
          </Button>
        </Box>
      </ModalBox>
    </Modal>
  );
}