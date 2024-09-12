import { create } from 'zustand';

type TranslationGroup = Record<string, Record<string, string>>;

type State = {
  keys: TranslationGroup;
  setKeys: (data: TranslationGroup) => void;
};

export const useLocaleStore = create<State>((set) => ({
  keys: {},
  setKeys: (value: TranslationGroup) => {
    set((prev) => ({ keys: { ...prev.keys, ...value } }));
  },
}));
