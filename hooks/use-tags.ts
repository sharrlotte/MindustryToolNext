import useClientAPI from '@/hooks/use-client';
import getTags from '@/query/tag/get-tags';
import TagGroup, { AllTagGroup } from '@/types/response/TagGroup';
import { useQuery } from '@tanstack/react-query';

export function useSearchTags(): AllTagGroup {
  const { axios } = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getTags(axios),
    queryKey: ['tags'],
  });

  return data ?? { schematic: [], map: [], post: [], plugin: [] };
}

export function usePostTags(): AllTagGroup {
  const { schematic, map, post, plugin } = useSearchTags();

  const predicate = (tag: TagGroup) => tag.name === 'size';

  return {
    schematic: schematic.filter(predicate),
    map: map.filter(predicate),
    post: post.filter(predicate),
    plugin: plugin.filter(predicate),
  };
}
