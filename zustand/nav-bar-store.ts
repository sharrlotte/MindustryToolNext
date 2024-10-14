import { create } from 'zustand';

type State = {
  isVisible: boolean;
  setVisible: (data: boolean) => void;
};

export const useNavBar = create<State>((set) => ({
  isVisible: false,
  setVisible: (data: boolean) => set({ isVisible: data }),
}));
