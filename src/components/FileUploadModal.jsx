import React, { useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

const ModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#121212',
  boxShadow: 24,
  borderRadius: '12px',
  padding: '24px',
  color: '#fff',
  textAlign: 'center',
  border: '1px solid #333',
});

const FileInput = styled('input')({
  display: 'none',
});

const UploadLabel = styled('label')({
  display: 'inline-block',
  margin: '16px 0',
  padding: '10px 20px',
  backgroundColor: '#2196f3',
  color: '#fff',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#1976d2',
  },
});

export default function FileUploadModal({ open, onClose, onUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      setFile(null);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <Typography variant="h6" gutterBottom>
          Upload a File
        </Typography>

        <FileInput 
          id="upload-input" 
          type="file" 
          accept="*/*" 
          onChange={handleFileChange} 
        />

        <UploadLabel htmlFor="upload-input">
          {file ? 'Change File' : 'Choose File'}
        </UploadLabel>

        {file && (
          <Typography variant="body2" sx={{ mt: 1, color: '#90caf9' }}>
            {file.name}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button onClick={onClose} sx={{ mr: 2 }} color="inherit">
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpload}
            disabled={!file}
          >
            Upload
          </Button>
        </Box>
      </ModalBox>
    </Modal>
  );
}
