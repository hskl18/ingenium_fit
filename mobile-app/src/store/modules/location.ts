import { create } from 'zustand';

import { storage } from '@/App.tsx';
import { Configs } from '@/common/configs.ts';

export const FALLBACK_LOCATION = {
  city: 'Pasadena, CA',
  coords: {
    latitude: 34.147785,
    longitude: -118.144516,
  },
};

const getInitialLocation = () => {
  const rawLocation = storage.getString(Configs.Location);
  if (!rawLocation) {
    return FALLBACK_LOCATION;
  }

  try {
    const parsed = JSON.parse(rawLocation);
    if (parsed && typeof parsed === 'object') {
      const coords = parsed.coords && typeof parsed.coords === 'object'
        ? {
            latitude:
              parsed.coords.latitude ?? FALLBACK_LOCATION.coords.latitude,
            longitude:
              parsed.coords.longitude ?? FALLBACK_LOCATION.coords.longitude,
          }
        : FALLBACK_LOCATION.coords;

      return {
        ...FALLBACK_LOCATION,
        ...parsed,
        city: parsed.city || FALLBACK_LOCATION.city,
        coords,
      };
    }
  } catch (error) {
    console.warn('Failed to parse stored location, falling back to default', error);
  }

  return FALLBACK_LOCATION;
};

const useLocationStore = create((set) => ({
  location: getInitialLocation(),
  resetAll: () => set({ location: FALLBACK_LOCATION }),
  setLocation: (location) =>
    set(() => ({
      location: {
        ...FALLBACK_LOCATION,
        ...location,
        coords: {
          ...FALLBACK_LOCATION.coords,
          ...(location?.coords || {}),
        },
      },
    })),
}));

export default useLocationStore;
