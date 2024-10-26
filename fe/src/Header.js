// Header.js
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar 
      position="static" 
      style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" style={{ flexGrow: 1, color: '#000000' }}>
          Adaptive Learning
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
