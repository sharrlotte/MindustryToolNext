import { useSearchParams } from 'next/navigation';
import { z } from 'zod';

import { groupParamsByKey } from '@/lib/utils';
import { QuerySchema } from '@/query/search-query';

export default function useSearchQuery<T extends QuerySchema>(schema: T, additional?: Record<string, any>): z.infer<T> {
  const query = useSearchParams();
  const data = groupParamsByKey(query);

  const result = schema.parse(data);

  if (additional) {
    return { ...result, ...additional };
  }

  return result;
}
