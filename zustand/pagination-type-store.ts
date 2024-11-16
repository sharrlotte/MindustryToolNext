'use client';

import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const paginationTypes = ['grid', 'infinite-scroll'] as const;
type PaginationType = (typeof paginationTypes)[number];

const PAGINATION_TYPE_PERSISTENT_KEY = 'PAGINATION_TYPE';
const DEFAULT_PAGINATION_TYPE = 'grid';

export function usePaginationType() {
  const [type, setType] = useLocalStorage(PAGINATION_TYPE_PERSISTENT_KEY, DEFAULT_PAGINATION_TYPE);

  useEffect(() => {
    const storedType = window.localStorage.getItem(PAGINATION_TYPE_PERSISTENT_KEY);

    if (storedType && paginationTypes.includes(storedType as any)) {
      setType(storedType as PaginationType);
    } else {
      setType(DEFAULT_PAGINATION_TYPE);
    }
  }, [setType]);

  function handleSetType(type: PaginationType) {
    setType(type);
    localStorage.setItem(PAGINATION_TYPE_PERSISTENT_KEY, type);
  }

  return {
    type,
    setType: handleSetType,
  };
}
