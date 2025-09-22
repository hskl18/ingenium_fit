import { create } from "zustand";
import { storage } from "@/storage";
import { Configs } from "@/common/configs.ts";

const useSearchStore = create((set) => ({
  resetAll: () => set({ historyList: [] }),
  setHistoryList: (historyList) =>
    set({
      historyList,
    }),
  historyList: JSON.parse(storage.getString(Configs.HistoryList) || "[]") || [],
}));

export default useSearchStore;
