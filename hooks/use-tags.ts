import { useMemo } from 'react';

import useClientAPI from '@/hooks/use-client';
import TagGroup, { AllTagGroup } from '@/types/response/TagGroup';

import { useQuery } from '@tanstack/react-query';
import { getTags } from '@/query/tag';

const EMPTY = { schematic: [], map: [], post: [], plugin: [] };

export function useSearchTags(): AllTagGroup {
  const axios = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getTags(axios),
    queryKey: ['tags'],
  });

  const groups = data ?? EMPTY;
  return useMemo(
    () => ({
      schematic: groups.schematic
        .sort()
        .map((item) => ({ ...item, values: item.values.sort() })),
      map: groups.map
        .sort()
        .map((item) => ({ ...item, values: item.values.sort() })),
      post: groups.post
        .sort()
        .map((item) => ({ ...item, values: item.values.sort() })),
      plugin: groups.plugin
        .sort()
        .map((item) => ({ ...item, values: item.values.sort() })),
    }),
    [groups],
  );
}

export function useUploadTags(): AllTagGroup {
  const { schematic, map, post, plugin } = useSearchTags();

  const predicate = (tag: TagGroup) => tag.name !== 'size';

  return useMemo(
    () => ({
      schematic: schematic.filter(predicate),
      map: map.filter(predicate),
      post: post.filter(predicate),
      plugin: plugin.filter(predicate),
    }),
    [schematic, map, post, plugin],
  );
}
