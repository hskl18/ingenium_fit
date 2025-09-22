import { create } from 'zustand';

const useUserStore = create((set) => ({
  resetAll: () => set({ userInfo: {} }),
  setUserInfo: (userInfo) =>
    set({
      userInfo,
    }),
  userInfo: {},
}));

export default useUserStore;
