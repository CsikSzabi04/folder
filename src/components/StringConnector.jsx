import React from 'react';
import { styled } from '@mui/system';

const ConnectorLine = styled('div')(({ source, target, color }) => {
  // Calculate line position and angle
  const sourceX = typeof source.x === 'string' ? 50 : source.x;
  const sourceY = typeof source.y === 'string' ? 50 : source.y;
  const targetX = typeof target.x === 'string' ? 50 : target.x;
  const targetY = typeof target.y === 'string' ? 50 : target.y;
  
  const length = Math.sqrt(
    Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2)
  );
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180 / Math.PI;
  
  return {
    position: 'absolute',
    left: `${sourceX}%`,
    top: `${sourceY}%`,
    width: `${length}%`,
    height: '2px',
    backgroundColor: color,
    transformOrigin: '0 0',
    transform: `rotate(${angle}deg)`,
    zIndex: -1,
  };
});

export default function StringConnector({ source, target, color }) {
  return <ConnectorLine source={source} target={target} color={color} />;
}