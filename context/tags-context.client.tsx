'use client';

import React, { ReactNode } from 'react';

import { AllTagGroup } from '@/types/response/TagGroup';

type ContextType = { searchTags: AllTagGroup; uploadTags: AllTagGroup };

export const EMPTY: AllTagGroup = {
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
