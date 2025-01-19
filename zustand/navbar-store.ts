import { create } from 'zustand';

type NavBarState = {
  visible: boolean;
  setVisible: (data: boolean) => void;
};

export const useNavBar = create<NavBarState>((set) => ({
  visible: false,
  setVisible: (data: boolean) => set((prev) => ({ ...prev, visible: data })),
}));
