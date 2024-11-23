'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import UrlEntry from './component/UrlEntry';

export default function HomePage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Yuanman's URL Shortener
        </Typography>
        <UrlEntry />
      </Box>
    </Container>
  );
}