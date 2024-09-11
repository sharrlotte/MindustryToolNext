import { create } from 'zustand';

type TranslationGroup = Record<string, Record<string, string>>;

type State = {
  keys: TranslationGroup;
  setKeys: (data: TranslationGroup) => void;
};

export const useExpandServerNav = create<State>((set) => ({
  keys: {},
  setKeys: (keys: TranslationGroup) => set({ keys }),
}));
