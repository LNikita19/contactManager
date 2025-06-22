import React, { useState, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Stack, Typography, Avatar, Divider, Fade, Tooltip, Snackbar, DialogContentText, Dialog as MuiDialog
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import useContactStore from '../store/useContactStore';
import { useContacts, useDeleteContact } from '../hooks/useContacts';
import ContactForm from './ContactForm';

const fetchContactById = async (id) => {
  const res = await fetch(`http://localhost:3001/contacts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch contact');
  return res.json();
};

const ContactModal = () => {
  const { selectedContactId, setSelectedContactId } = useContactStore();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const { data } = useContacts({ page: 1, limit: 100 });
  const deleteContact = useDeleteContact();

  const contacts = data?.data || [];
  const { data: contact, isLoading } = useQuery({
    queryKey: ['contact', selectedContactId],
    queryFn: () => fetchContactById(selectedContactId),
    enabled: !!selectedContactId,
  });

  const handleClose = () => {
    setIsEditing(false);
    setSelectedContactId(null);
  };

  const handleDelete = () => {
    if (contact) {
      deleteContact.mutate(contact.id, {
        onSuccess: () => {
          setSnackbar({ open: true, message: 'Contact deleted' });
          handleClose();
        },
      });
    }
  };

  const getHumanAvatar = (contact) => {
    if (contact.avatar) return contact.avatar;
    const id = contact.id || contact.name?.charCodeAt(0) || 1;
    const gender = id % 2 === 0 ? 'men' : 'women';
    const avatarId = (id % 99) + 1;
    return `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`;
  };

  if (!selectedContactId || !contact) return null;

  return (
    <>
      <Dialog
        open={!!selectedContactId}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            bgcolor: 'background.paper',
            boxShadow: 12,
            backgroundImage: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #23272a 0%, #181a1b 100%)'
                : 'linear-gradient(135deg, #fff 0%, #f4f6fa 100%)',
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={getHumanAvatar(contact)}
              sx={{
                bgcolor: contact.avatar ? 'transparent' : (contact.favourite ? 'warning.main' : 'primary.main'),
                width: 56,
                height: 56,
                border: 3,
                borderStyle: 'solid',
                borderColor: contact.favourite ? 'warning.light' : 'primary.light',
                boxShadow: 2,
              }}
            >
              {(!contact.avatar && contact.name) ? contact.name[0].toUpperCase() : null}
            </Avatar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {isEditing ? 'Edit Contact' : contact.name}
            </Typography>
            {!isEditing && (
              <>
                <Tooltip title="Edit">
                  <IconButton color="primary" onClick={() => setIsEditing(true)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => setDeleteDialogOpen(true)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {isEditing ? (
            <ContactForm contact={contact} onSuccess={handleClose} />
          ) : (
            <Stack spacing={2} mt={2}>
              <Typography variant="body1"><b>Email:</b> {contact.email}</Typography>
              <Typography variant="body1"><b>Phone:</b> {contact.phone}</Typography>
              <Typography variant="body1"><b>Address:</b> {contact.address}</Typography>
              <Typography variant="body1">
                <b>Favourite:</b> {contact.favourite ? 'Yes' : 'No'}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <MuiDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <b>{contact.name}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </MuiDialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default ContactModal;
