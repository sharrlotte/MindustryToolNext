import { create } from 'zustand';

type State = {
  expand: boolean;
  setExpand: (data: boolean) => void;
};

export const useExpand = create<State>((set) => ({
  expand: true,
  setExpand: (data: boolean) => set({ expand: data }),
}));
