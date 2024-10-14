import { create } from 'zustand';

type State = {
  visible: boolean;
  setVisible: (data: boolean) => void;
};

export const useServerNavBar = create<State>((set) => ({
  visible: false,
  setVisible: (data: boolean) => set({ visible: data }),
}));
