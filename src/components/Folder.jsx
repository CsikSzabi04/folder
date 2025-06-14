import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import { styled } from '@mui/system';

const FolderContainer = styled(Box)(({ position, theme }) => ({
  position: 'absolute',
  left: `${position.x}%`,
  top: `${position.y}%`,
  cursor: 'move',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 10,
  '&:hover': {
    transform: 'scale(1.15)',
    '& .folder-icon': {
      filter: 'drop-shadow(0 0 8px rgba(100, 200, 255, 0.7))',
    }
  },
}));

const StyledFolderIcon = styled(FolderIcon)(({ theme, hasitems }) => ({
  fontSize: 56,
  color: hasitems ? '#FFD700' : '#4fc3f7',
  transition: 'all 0.3s ease',
}));

export default function Folder({ folder, onClick, onMove, onCreateConnection, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - folder.position.x,
      y: e.clientY - folder.position.y
    });
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleDrag = (e) => {
    if (isDragging && e.clientX !== 0 && e.clientY !== 0) {
      const newX = Math.max(5, Math.min(95, e.clientX - dragStart.x));
      const newY = Math.max(5, Math.min(95, e.clientY - dragStart.y));
      onMove(folder.id, { x: newX, y: newY });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCreateConnection = (color) => {
    onCreateConnection(color);
    handleClose();
  };

  return (
    <>
      <FolderContainer
        position={folder.position}
        onClick={onClick}
        onContextMenu={handleContextMenu}
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <Tooltip title={folder.name} arrow>
          <Box sx={{ position: 'relative' }}>
            <StyledFolderIcon className="folder-icon" hasitems={folder.items.length > 0} />
            {folder.items.length > 0 && (
              <Box sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                backgroundColor: '#ff4081',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}>
                {folder.items.length}
              </Box>
            )}
          </Box>
        </Tooltip>
        <Typography variant="caption" noWrap sx={{ 
          maxWidth: '100px',
          textOverflow: 'ellipsis',
          color: '#e6f7ff',
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          mt: 1
        }}>
          {folder.name}
        </Typography>
      </FolderContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'folder-menu',
        }}
      >
        <MenuItem onClick={() => handleCreateConnection('#00ffff')}>
          <LinkIcon sx={{ mr: 1, color: '#00ffff' }} /> Connect (Cyan)
        </MenuItem>
        <MenuItem onClick={() => handleCreateConnection('#ff4081')}>
          <LinkIcon sx={{ mr: 1, color: '#ff4081' }} /> Connect (Pink)
        </MenuItem>
        <MenuItem onClick={() => handleCreateConnection('#76ff03')}>
          <LinkIcon sx={{ mr: 1, color: '#76ff03' }} /> Connect (Lime)
        </MenuItem>
        <MenuItem onClick={() => { onDelete(); handleClose(); }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete Folder
        </MenuItem>
      </Menu>
    </>
  );
}