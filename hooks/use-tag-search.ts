import useClientApi from '@/hooks/use-client';
import { searchTags } from '@/query/tag';
import { DetailTagDto } from '@/types/response/Tag';

import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function useTagSearch(fullNames: string[]) {
  const queryClient = useQueryClient();
  const axios = useClientApi();

  return useQuery({
    queryKey: ['tag-search', fullNames],
    queryFn: async () => {
      const cached = queryClient.getQueryData<DetailTagDto[]>(['tag-search']) ?? [];

      let saved: DetailTagDto[] = [];

      if (cached.length > 0) {
        saved = cached.filter((c) => fullNames.includes(c.name));
        fullNames = fullNames.filter((f) => !cached.some((c) => c.name === f));
      }

      if (fullNames.length === 0) {
        return saved;
      }

      return searchTags(axios, fullNames) //
        .then((result) => result.concat(saved))
        .then((data) => {
          queryClient.setQueryData(['tag-search'], data);
          return data;
        });
    },
  });
}
