import useClientAPI from '@/hooks/use-client';
import getTags from '@/query/tag/get-tags';
import { AllTagGroup } from '@/types/response/TagGroup';
import { useQuery } from '@tanstack/react-query';

export default function useTags(): AllTagGroup {
  const { axios } = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getTags(axios),
    queryKey: ['tags'],
  });

  return data ?? { schematic: [], map: [], post: [], plugin: [] };
}
