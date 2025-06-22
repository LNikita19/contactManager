import { create } from 'zustand';

const useContactStore = create((set) => ({
    selectedContactId: null,
    setSelectedContactId: (id) => set({ selectedContactId: id }),
    editModalOpen: false,
    setEditModalOpen: (val) => set({ editModalOpen: val }),


    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),

    showFavouritesOnly: false,
    toggleShowFavouritesOnly: () =>
        set((state) => ({ showFavouritesOnly: !state.showFavouritesOnly })),
}));

export default useContactStore;