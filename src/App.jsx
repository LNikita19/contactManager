import React, { useState, useMemo } from 'react';
import { Container, Fab, AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddContactModal from './components/AddContactModal';
import ContactList from './components/ContactList';
import ContactModal from './components/ContactModal';

export default function App() {
  const [isAddOpen, setAddOpen] = useState(false);
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                background: {
                  default: '#181a1b',
                  paper: '#23272a',
                },
              }
            : {}),
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" color="primary" elevation={2}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2 }}>
              📒 Contact Manager
            </Typography>
            <IconButton
              sx={{ ml: 1 }}
              color="inherit"
              onClick={() => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 0 }}>
          {/* Contact list */}
          <ContactList />

          {/* Add Contact Modal */}
          <AddContactModal open={isAddOpen} onClose={() => setAddOpen(false)} />

          {/* Contact Details/Edit Modal */}
          <ContactModal />

          {/* Floating Action Button */}
          <Fab
            color="secondary"
            aria-label="add"
            onClick={() => setAddOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              boxShadow: 4,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <AddIcon />
          </Fab>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
