import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Checkbox, FormControlLabel
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAddContact } from '../hooks/useContacts';

export default function AddContactModal({ open, onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const mutation = useAddContact();

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Contact</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} id="add-contact-form">
          <TextField fullWidth margin="dense" label="Name" {...register('name', { required: true })} />
          <TextField fullWidth margin="dense" label="Email" {...register('email', { required: true })} />
          <TextField fullWidth margin="dense" label="Phone" {...register('phone', { required: true })} />
          <TextField fullWidth margin="dense" label="Address" {...register('address')} />
          <FormControlLabel control={<Checkbox {...register('favourite')} />} label="Favourite" />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="add-contact-form" variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
