import React, { ReactNode } from 'react';

import TagGroup, { AllTagGroup } from '@/types/response/TagGroup';
import { getTags } from '@/query/tag';
import axiosInstance from '@/query/config/config';
import { isError } from '@/lib/utils';
import ErrorScreen from '@/components/common/error-screen';
import { TagsProviderClient } from '@/context/tags-context.client';

const predicate = (tag: TagGroup) => tag.name !== 'size';

export async function TagsProvider({ children }: { children: ReactNode }) {
  const data = await getTags(axiosInstance);

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
