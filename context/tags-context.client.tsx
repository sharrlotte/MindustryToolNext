'use client';

import React, { ReactNode } from 'react';

import { ContextTagGroup } from '@/context/tags-context';

type ContextType = { searchTags: ContextAllTagGroup; uploadTags: ContextAllTagGroup };

export type ContextAllTagGroup = {
  schematic: ContextTagGroup[];
  map: ContextTagGroup[];
  post: ContextTagGroup[];
  plugin: ContextTagGroup[];
};

export const EMPTY: ContextAllTagGroup = {
  schematic: [],
  map: [],
  post: [],
  plugin: [],
};

const Context = React.createContext<ContextType>({ searchTags: EMPTY, uploadTags: EMPTY });

export function useTags(): ContextType {
  const context = React.useContext(Context);

  return context;
}

export function TagsProviderClient({ children, tags }: { tags: ContextType; children: ReactNode }) {
  return <Context.Provider value={tags}>{children}</Context.Provider>;
}
