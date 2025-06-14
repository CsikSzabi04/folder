import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, IconButton } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

const ItemPaper = styled(Paper)(({ theme }) => ({
  padding: '12px',
  margin: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '140px',
  width: '140px',
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(100, 200, 255, 0.3)',
  },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 4,
  color: theme.palette.error.main,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  width: 24,
  height: 24,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

export default function FolderContent({ 
  folder, 
  onUploadClick, 
  onCreateTextClick,
  onTextFileClick,
  onDeleteFile,
  onReorderItems // New prop for handling reorder
}) {
  // Local state to track drag source index
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // Handler for drag start
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index); // store index as string
  };

  // Handler for drag over - must prevent default to allow drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handler for drop - reorder the items
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex === dropIndex) return;

    const newItems = [...folder.items];
    const draggedItem = newItems[dragIndex];
    // Remove dragged item
    newItems.splice(dragIndex, 1);
    // Insert dragged item at dropIndex
    newItems.splice(dropIndex, 0, draggedItem);

    if (onReorderItems) {
      onReorderItems(newItems);
    }
    setDraggedItemIndex(null);
  };

  // Handler for drag end - cleanup
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 2
      }}>
        <Typography variant="h5" sx={{ color: '#ffffff' }}>
          {folder.name}
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<InsertPhotoIcon />}
            onClick={onUploadClick}
            sx={{ mr: 1, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}
          >
            Upload
          </Button>
          <Button
            variant="contained"
            startIcon={<TextFieldsIcon />}
            onClick={onCreateTextClick}
            sx={{ background: 'linear-gradient(45deg, #FF4081 30%, #FF9100 90%)' }}
          >
            Add Note
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ 
        maxHeight: 'calc(100% - 80px)', 
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255,255,255,0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '3px',
        },
      }}>
        {folder.items.map((item, index) => (
          <Grid 
            item 
            key={item.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <ItemPaper elevation={0} onClick={() => {
              if (item.type === 'text') onTextFileClick(item);
            }}>
              {item.type === 'image' ? (
                <>
                  <DeleteButton onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(item.id, item.type);
                  }}>
                    <DeleteIcon fontSize="small" />
                  </DeleteButton>
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100px',
                      borderRadius: '4px'
                    }}
                  />
                  <Typography variant="caption" sx={{ 
                    mt: 1, 
                    color: 'rgba(255,255,255,0.8)',
                    textAlign: 'center',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.name}
                  </Typography>
                </>
              ) : item.type === 'text' ? (
                <>
                  <DeleteButton onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(item.id, item.type);
                  }}>
                    <DeleteIcon fontSize="small" />
                  </DeleteButton>
                  <TextFieldsIcon sx={{ fontSize: 40, color: '#4fc3f7', mb: 1 }} />
                  <Typography variant="subtitle2" noWrap sx={{ 
                    fontWeight: 'bold',
                    color: '#ffffff',
                    width: '100%',
                    textAlign: 'center'
                  }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" noWrap sx={{ 
                    mt: 1,
                    color: 'rgba(255,255,255,0.7)',
                    width: '100%',
                    textAlign: 'center'
                  }}>
                    {item.content.substring(0, 30)}...
                  </Typography>
                </>
              ) : (
                <>
                  <DeleteButton onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(item.id, item.type);
                  }}>
                    <DeleteIcon fontSize="small" />
                  </DeleteButton>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {item.name}
                  </Typography>
                </>
              )}
            </ItemPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
