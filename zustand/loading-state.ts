import { ReactNode, useEffect } from 'react';
import { create } from 'zustand';

type State = {
  isLoading: boolean;
  message?: ReactNode;
  setLoading: (data: boolean, message?: ReactNode) => void;
};

export const useLoadingState = create<State>((set) => ({
  isLoading: false,
  setLoading: (data: boolean, message?: ReactNode) =>
    set({ message, isLoading: data }),
}));

export function useShowLoading(state: boolean[], message?: ReactNode) {
  const setLoading = useLoadingState((state) => state.setLoading);
  const isLoading = state.some(Boolean);

  useEffect(() => setLoading(isLoading, message), [isLoading]);

  return isLoading;
}
