import axiosInstance from '@/query/config/config';
import { getTags } from '@/query/tag';
import TagGroup, { AllTagGroup } from '@/types/response/TagGroup';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const EMPTY: AllTagGroup = {
  schematic: [],
  map: [],
  post: [],
  plugin: [],
};

export default function useTags() {
  let { data } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(axiosInstance),
  });

  data = data ?? EMPTY;

  const searchTags: AllTagGroup = useMemo(
    () => ({
      schematic: data.schematic.sort().map((item) => ({ ...item, values: item.values.sort() })),
      map: data.map.sort().map((item) => ({ ...item, values: item.values.sort() })),
      post: data.post.sort().map((item) => ({ ...item, values: item.values.sort() })),
      plugin: data.plugin.sort().map((item) => ({ ...item, values: item.values.sort() })),
    }),
    [data.map, data.plugin, data.post, data.schematic],
  );

  const predicate = (tag: TagGroup) => tag.name !== 'size';

  const uploadTags: AllTagGroup = useMemo(
    () => ({
      schematic: data.schematic.filter(predicate),
      map: data.map.filter(predicate),
      post: data.post.filter(predicate),
      plugin: data.plugin.filter(predicate),
    }),
    [data.map, data.plugin, data.post, data.schematic],
  );

  return { searchTags, uploadTags };
}
