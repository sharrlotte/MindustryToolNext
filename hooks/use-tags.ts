import getTags from '@/query/tag/get-tags';
import { useQuery } from '@tanstack/react-query';

export default function useTags() {
  return useQuery({
    queryFn: getTags,
    queryKey: ['tags'],
  });
}
