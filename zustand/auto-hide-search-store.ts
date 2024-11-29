import { create } from 'zustand';

type VerifyCount = {
  visible: boolean;
  setVisible: (data: boolean) => void;
};

export const useSearchBarVisibility = create<VerifyCount>((set) => ({
  visible: true,
  setVisible: (data: boolean) => set((prev) => ({ ...prev, visible: data })),
}));
