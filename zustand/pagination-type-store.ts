'use client';

import { useLocalStorage } from 'usehooks-ts';

const paginationTypes = ['grid', 'infinite-scroll'] as const;
type PaginationType = (typeof paginationTypes)[number];

const PAGINATION_TYPE_PERSISTENT_KEY = 'PAGINATION_TYPE';
const DEFAULT_PAGINATION_TYPE = 'grid';

export function usePaginationType() {
  const [type, setType] = useLocalStorage(PAGINATION_TYPE_PERSISTENT_KEY, DEFAULT_PAGINATION_TYPE);
  function handleSetType(type: PaginationType) {
    console.log(type);
    setType(type || DEFAULT_PAGINATION_TYPE);
  }

  return {
    type,
    setType: handleSetType,
  };
}
