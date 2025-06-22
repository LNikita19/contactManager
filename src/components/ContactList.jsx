import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  Pagination,
  Stack,
  Tooltip,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import useContactStore from '../store/useContactStore';
import { useContacts, useUpdateContact } from '../hooks/useContacts';
import CircularProgress from '@mui/material/CircularProgress';

const getHumanAvatar = (contact) => {
  if (contact.avatar) return contact.avatar;
  const id = contact.id || contact.name?.charCodeAt(0) || 1;
  const gender = id % 2 === 0 ? 'men' : 'women';
  const avatarId = (id % 99) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`;
};

const ContactList = () => {
  const [page, setPage] = useState(1);
  const [view, setView] = useState('card'); 
  const { searchQuery, setSearchQuery, showFavouritesOnly, toggleShowFavouritesOnly, setSelectedContactId } = useContactStore();
  
  const {
    data: result,
    isLoading,
  } = useContacts({ page : page, limit: 9, search: searchQuery, showFavouritesOnly });

  const contacts = result?.data || [];
  const total = result?.total || 0;
  const updateContact = useUpdateContact();

  const toggleFavourite = (contact) => {
    updateContact.mutate({
      id: contact.id,
      updates: { ...contact, favourite: !contact.favourite }
    });
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        width: '100%',
        px: 2,
        mt: 4,
        mb: '-1px',
        boxSizing: 'border-box',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        mb={3}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      >
        <TextField
          placeholder="Search contacts…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 2,
            minWidth: { xs: '100%', sm: 320 },
            '& .MuiInputBase-root': {
              fontSize: 18,
              py: 1.2,
              px: 1.5,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.light',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            ),
            sx: { fontWeight: 500 }
          }}
        />
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title={showFavouritesOnly ? "Show All Contacts" : "Show Favourites Only"}>
            <IconButton
              onClick={toggleShowFavouritesOnly}
              color={showFavouritesOnly ? "warning" : "default"}
              sx={{
                bgcolor: showFavouritesOnly ? '#fffde7' : 'background.paper',
                border: showFavouritesOnly ? '2px solid #FFD740' : '2px solid transparent',
                boxShadow: showFavouritesOnly ? 3 : 1,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#fffde7',
                  borderColor: '#FFD740'
                }
              }}
              size="large"
            >
              {showFavouritesOnly ? <StarIcon fontSize="large" /> : <StarBorderIcon fontSize="large" />}
            </IconButton>
          </Tooltip>
          <Typography
            variant="subtitle1"
            sx={{
              color: showFavouritesOnly ? 'warning.main' : 'text.secondary',
              fontWeight: showFavouritesOnly ? 700 : 500,
              transition: 'color 0.2s'
            }}
          >
            {showFavouritesOnly ? 'Favourites' : 'All Contacts'}
          </Typography>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, next) => next && setView(next)}
            size="small"
            sx={{ ml: 2 }}
          >
            <ToggleButton value="card" aria-label="Card View">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="List View">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : view === 'card' ? (
        <Grid container spacing={3}>
          {contacts.map((contact) => (
            <Grid item xs={12} sm={6} md={4} key={contact.id}>
              <Card
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  bgcolor: contact.favourite
                    ? 'linear-gradient(135deg, #fffbe6 0%, #fffde7 100%)'
                    : 'background.paper',
                  color: 'text.primary',
                  borderLeft: contact.favourite ? '6px solid #FFD740' : '6px solid transparent',
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 2,
                  minHeight: 210,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': {
                    boxShadow: 10,
                    transform: 'translateY(-4px) scale(1.03)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => setSelectedContactId(contact.id)}
                variant="outlined"
              >
                <IconButton
                  onClick={e => { e.stopPropagation(); toggleFavourite(contact); }}
                  color={contact.favourite ? "warning" : "default"}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    zIndex: 2,
                    '&:hover': { bgcolor: 'background.paper' }
                  }}
                  size="large"
                >
                  {contact.favourite ? <StarIcon fontSize="large" /> : <StarBorderIcon fontSize="large" />}
                </IconButton>

                <Stack alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <Avatar
                    src={getHumanAvatar(contact)}
                    sx={{
                      bgcolor: contact.avatar ? 'transparent' : (contact.favourite ? 'warning.main' : 'primary.main'),
                      color: 'white',
                      width: 72,
                      height: 72,
                      fontWeight: 700,
                      fontSize: 32,
                      boxShadow: 3,
                      objectFit: 'cover',
                      border: contact.favourite ? '2px solid #FFD740' : undefined,
                      mb: 1
                    }}
                  >
                    {(!contact.avatar && contact.name) ? contact.name[0].toUpperCase() : null}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 22, textAlign: 'center' }}>
                    {contact.name}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {contact.email}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {contact.phone}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      fontStyle: 'italic',
                      opacity: 0.8,
                      minHeight: 32
                    }}
                  >
                    {contact.address}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          {contacts.map((contact, idx) => (
            <React.Fragment key={contact.id}>
              <ListItem
                alignItems="flex-start"
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelectedContactId(contact.id)}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={contact.favourite ? "Unmark Favourite" : "Mark as Favourite"}>
                      <IconButton
                        onClick={e => { e.stopPropagation(); toggleFavourite(contact); }}
                        color={contact.favourite ? "warning" : "default"}
                        size="small"
                      >
                        {contact.favourite ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </Tooltip>
                    <IconButton href={`mailto:${contact.email}`} size="small">
                      <EmailIcon fontSize="small" />
                    </IconButton>
                    <IconButton href={`tel:${contact.phone}`} size="small">
                      <PhoneIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    src={getHumanAvatar(contact)}
                    sx={{
                      bgcolor: contact.avatar ? 'transparent' : (contact.favourite ? 'warning.main' : 'primary.main'),
                      color: 'white',
                      width: 40,
                      height: 40,
                      fontWeight: 700,
                      fontSize: 20,
                      boxShadow: 1,
                      objectFit: 'cover'
                    }}
                  >
                    {(!contact.avatar && contact.name) ? contact.name[0].toUpperCase() : null}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {contact.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">{contact.email}</Typography>
                      <Typography variant="body2" color="text.secondary">{contact.phone}</Typography>
                      <Typography variant="body2" color="text.secondary">{contact.address}</Typography>
                    </>
                  }
                />
              </ListItem>
              {idx < contacts.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
      {contacts.length === 0 && !isLoading && (
        <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
          <img src="/empty-contacts.svg" alt="No contacts" width={120} style={{ opacity: 0.7 }} />
          <Typography variant="h6" sx={{ mt: 2 }}>No contacts found</Typography>
          <Typography variant="body2">Try adding a new contact or changing your search.</Typography>
        </Box>
      )}
      <Box
        sx={{
          mt: 2,
          pb: 4,
          bgcolor: 'background.default',
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 1,
          }}
        >
          Showing {contacts.length} of {total} contacts
        </Typography>
        <Pagination
          count={Math.ceil(total / 9)}
          page={page}
          onChange={(e, value) => setPage(value)}
          sx={{ display: 'flex', justifyContent: 'center' }}
          color="primary"
          size="large"
        />
      </Box>
    </Box>
  );
};

export default ContactList;
