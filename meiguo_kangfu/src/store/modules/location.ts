import { create } from 'zustand';
import { storage } from '@/App.tsx';
import { Configs } from '@/common/configs.ts';

const useLocationStore = create((set) => ({
  resetAll: () => set({ location: {} }),
  setLocation: (location) =>
    set({
      location,
    }),
  location: JSON.parse(storage.getString(Configs.Location) || '{}') || {},
}));

export default useLocationStore;
