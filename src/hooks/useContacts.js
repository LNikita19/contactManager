import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:3001/contacts';

const fetchContacts = async ({ page = 1, limit = 10, search = '', showFavouritesOnly = false }) => {
  const url = new URL(API_URL);
  url.searchParams.set('_page', page);
  url.searchParams.set('_limit', limit);
  if (search) url.searchParams.set('q', search);
  if (showFavouritesOnly) url.searchParams.set('favourite', true); // <-- server-side filter

  const response = await fetch(url);

  if (!response.ok) throw new Error('Failed to fetch contacts');

  const totalCount = response.headers.get('X-Total-Count');
  const data = await response.json();

  return {
    data,
    total: parseInt(totalCount, 10) || data.length,
  };
};



export const useContacts = ({ page, limit, search, showFavouritesOnly }) => {
  return useQuery({
    queryKey: ['contacts', page, search, showFavouritesOnly],
    queryFn: () => fetchContacts({ page, limit, search, showFavouritesOnly }),
    keepPreviousData: true,
  });
};

export const useAddContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newContact) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });
      if (!response.ok) throw new Error('Failed to add contact');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update contact');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete contact');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
  });
};
