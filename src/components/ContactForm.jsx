import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Stack
} from '@mui/material';
import { useAddContact, useUpdateContact } from '../hooks/useContacts';

const ContactForm = ({ contact, onSuccess }) => {
  const isEdit = !!contact;
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: contact || {
      name: '',
      email: '',
      phone: '',
      address: '',
      favourite: false
    }
  });

  const [favourite, setFavourite] = useState(contact?.favourite ?? false);

  const addContact = useAddContact();
  const updateContact = useUpdateContact();

  useEffect(() => {
    setFavourite(contact?.favourite ?? false);
  }, [contact]);

  const onSubmit = (data) => {
    const finalData = { ...data, favourite };
    if (isEdit) {
      updateContact.mutate({ id: contact.id, updates: finalData }, { onSuccess });
    } else {
      addContact.mutate(finalData, {
        onSuccess: () => {
          reset();
          onSuccess();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <TextField
          label="Name"
          {...register('name', { required: 'Name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />
        <TextField
          label="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email format' },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />
        <TextField
          label="Phone"
          {...register('phone', {
            required: 'Phone is required',
            pattern: { value: /^[0-9\-\+\s()]*$/, message: 'Invalid phone number' },
          })}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          fullWidth
        />
        <TextField
          label="Address"
          {...register('address', { required: 'Address is required' })}
          error={!!errors.address}
          helperText={errors.address?.message}
          fullWidth
        />
        <FormControlLabel
          control={<Checkbox 
            {...register('favourite')} 
            checked={favourite} 
            onChange={(e) => setFavourite(e.target.checked)} 
          />}
          label="Favourite"
        />
        <Button type="submit" variant="contained">
          {isEdit ? 'Update Contact' : 'Add Contact'}
        </Button>
      </Stack>
    </form>
  );
};

export default ContactForm;
