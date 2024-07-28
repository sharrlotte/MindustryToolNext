import { useEffect } from 'react';
import { create } from 'zustand';

const paginationTypes = ['grid', 'infinite-scroll'] as const;
type PaginationType = (typeof paginationTypes)[number];

type State = {
  type: PaginationType;
  setType: (data: PaginationType) => void;
};

const internal = create<State>((set) => ({
  type: 'grid',
  setType: (data: PaginationType) => set({ type: data }),
}));

const PAGINATION_TYPE_PERSISTENT_KEY = 'pagination';
const DEFAULT_PAGINATION_TYPE = 'grid';

export function usePaginationType() {
  const { type, setType } = internal();

  useEffect(() => {
    const storedType = window.localStorage.getItem(
      PAGINATION_TYPE_PERSISTENT_KEY,
    );
    if (storedType && paginationTypes.includes(storedType as any)) {
      setType(storedType as PaginationType);
    } else {
      setType(DEFAULT_PAGINATION_TYPE);
    }
  }, [setType]);

  useEffect(() => {
    localStorage.setItem(PAGINATION_TYPE_PERSISTENT_KEY, type);
  }, [type]);

  return {
    type,
    setType,
  };
}
