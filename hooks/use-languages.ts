import useClientAPI from '@/hooks/use-client';
import getLanguages from '@/query/language/get-languages';

import { useQuery } from '@tanstack/react-query';

export default function useLanguages(): string[] {
  const axios = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getLanguages(axios),
    queryKey: ['languages'],
  });

  return data ?? [];
}
