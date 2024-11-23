'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';

export default function UrlEntry() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const isValidUrl = (url: string): boolean => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)' + 
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
        '((\\d{1,3}\\.){3}\\d{1,3}))' + 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
        '(\\?[;&a-z\\d%_.~+=-]*)?' + 
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!urlPattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    if (!isValidUrl(originalUrl)) {
      setError('Please enter a valid URL (must include http:// or https://).');
      return;
    }

    try {
      const response = await fetch('/api/shorten_alias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, alias }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
      } else {
        setShortUrl(`${window.location.origin}/${alias}`);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Something went wrong:(');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Original URL"
        variant="outlined"
        fullWidth
        required
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        margin="normal"
        helperText="Remember to include http:// or https://"
      />
      <TextField
        label="Alias"
        variant="outlined"
        fullWidth
        required
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        margin="normal"
        helperText="Enter a custom alias for your URL"
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
            mt: 4,
            backgroundColor: '#AFAC9D', 
            '&:hover': {
              backgroundColor: '#514549', 
            },
          }}
      >
        Shorten URL!
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {shortUrl && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Your shortened URL:</Typography>
          <TextField
            value={shortUrl}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCopy} edge="end">
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mt: 1 }}
          />
        </Box>
      )}
    </Box>
  );
}