import { useMemo } from 'react';

import useClientAPI from '@/hooks/use-client';
import getTags from '@/query/tag/get-tags';
import TagGroup, { AllTagGroup } from '@/types/response/TagGroup';

import { useQuery } from '@tanstack/react-query';

export function useSearchTags(): AllTagGroup {
  const axios = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getTags(axios),
    queryKey: ['tags'],
  });

  return data ?? { schematic: [], map: [], post: [], plugin: [] };
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
