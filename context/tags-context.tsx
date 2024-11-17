import { unstable_cache } from 'next/cache';
import React, { ReactNode } from 'react';

import ErrorScreen from '@/components/common/error-screen';
import { TagsProviderClient } from '@/context/tags-context.client';
import { isError } from '@/lib/utils';
import axiosInstance from '@/query/config/config';
import { getTags } from '@/query/tag';
import TagGroup, { AllTagGroup } from '@/types/response/TagGroup';

const predicate = (tag: TagGroup) => tag.name !== 'size';

const getCachedTags = unstable_cache(() => getTags(axiosInstance), ['tags'], { revalidate: 60000 });

export async function TagsProvider({ children }: { children: ReactNode }) {
  const data = await getCachedTags();

  if (isError(data)) {
    return <ErrorScreen error={data} />;
  }

  const searchTags: AllTagGroup = {
    schematic: data.schematic.sort().map((item) => ({ ...item, values: item.values.sort() })),
    map: data.map.sort().map((item) => ({ ...item, values: item.values.sort() })),
    post: data.post.sort().map((item) => ({ ...item, values: item.values.sort() })),
    plugin: data.plugin.sort().map((item) => ({ ...item, values: item.values.sort() })),
  };

  const uploadTags: AllTagGroup = {
    schematic: data.schematic.filter(predicate),
    map: data.map.filter(predicate),
    post: data.post.filter(predicate),
    plugin: data.plugin.filter(predicate),
  };

  return <TagsProviderClient tags={{ searchTags, uploadTags }}>{children}</TagsProviderClient>;
}
