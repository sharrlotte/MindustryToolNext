import useClient from '@/hooks/use-client';
import getTags from '@/query/tag/get-tags';
import { useQuery } from '@tanstack/react-query';

export default function useTags() {
  const { axiosClient } = useClient();
  return useQuery({
    queryFn: () => getTags(axiosClient),
    queryKey: ['tags'],
  });
}
