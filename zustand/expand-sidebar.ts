import { create } from 'zustand';

type State = {
  expand: boolean;
  setExpand: (data: boolean) => void;
};

export const useExpandSidebar = create<State>((set) => ({
  expand: false,
  setExpand: (data: boolean) => set({ expand: data }),
}));
