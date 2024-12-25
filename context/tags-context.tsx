import { unstable_cache } from 'next/cache';
import React, { ReactNode } from 'react';

import ErrorScreen from '@/components/common/error-screen';

import { catchError, translate } from '@/action/action';
import { ContextAllTagGroup, TagsProviderClient } from '@/context/tags-context.client';
import { Locale } from '@/i18n/config';
import { isError } from '@/lib/utils';
import axiosInstance from '@/query/config/config';
import { getTags } from '@/query/tag';
import TagGroup from '@/types/response/TagGroup';

const predicate = (tag: ContextTagGroup) => tag.name !== 'size';

const getCachedTags = unstable_cache(
  async (locale: Locale) => {
    const data = await catchError(axiosInstance, () => getTags(axiosInstance));

    if (isError(data)) {
      throw data;
    }

    function map(items: TagGroup[]): Promise<ContextTagGroup[]> {
      return Promise.all(
        items.sort().map(async (item) => ({
          ...item,
          name: item.name,
          displayName: await translate(locale, `tags.${item.name}`),
          values: await Promise.all(item.values.sort().map(async (value) => ({ value, display: await translate(locale, `tags.${value}`) }))),
        })),
      );
    }

    return {
      schematic: await map(data.schematic),
      map: await map(data.map),
      post: await map(data.post),
      plugin: await map(data.plugin),
    };
  },
  ['tags'],
  { revalidate: 3600 },
);

export type ContextTagGroup = {
  name: string;
  displayName: string;
  values: {
    value: string;
    display: string;
  }[];
  color: string;
  duplicate: boolean;
};

export async function TagsProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const searchTags = await getCachedTags(locale);

  if (isError(searchTags)) {
    return <ErrorScreen error={searchTags} />;
  }

  const uploadTags: ContextAllTagGroup = {
    schematic: searchTags.schematic.filter(predicate),
    map: searchTags.map.filter(predicate),
    post: searchTags.post.filter(predicate),
    plugin: searchTags.plugin.filter(predicate),
  };

  return <TagsProviderClient tags={{ searchTags, uploadTags }}>{children}</TagsProviderClient>;
}
