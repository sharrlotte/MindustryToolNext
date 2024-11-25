'use client';

import { useEffect } from 'react';
import { create } from 'zustand';

const paginationTypes = ['grid', 'infinite-scroll'] as const;
type PaginationType = (typeof paginationTypes)[number];

const PAGINATION_TYPE_PERSISTENT_KEY = 'PAGINATION_TYPE';
const DEFAULT_PAGINATION_TYPE = 'grid';

type PaginationStoreType = {
  type: PaginationType;
  setType: (type: PaginationType) => void;
};

const usePaginationStore = create<PaginationStoreType>((set) => ({
  type: DEFAULT_PAGINATION_TYPE,
  setType: (type: PaginationType) => set({ type }),
}));

export function usePaginationType() {
  const { type, setType } = usePaginationStore();

  function handleSetType(type: PaginationType) {
    setType(type ?? DEFAULT_PAGINATION_TYPE);
    localStorage.setItem(PAGINATION_TYPE_PERSISTENT_KEY, type);
  }

  useEffect(() => {
    const storedType = localStorage.getItem(PAGINATION_TYPE_PERSISTENT_KEY);
    if (paginationTypes.includes(storedType as PaginationType)) {
      setType(storedType as PaginationType);
    } else {
      setType(DEFAULT_PAGINATION_TYPE);
    }
  }, [setType]);

  return {
    type,
    setType: handleSetType,
  };
}
