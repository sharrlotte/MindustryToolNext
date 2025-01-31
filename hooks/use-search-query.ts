import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { z } from 'zod';

import { groupParamsByKey } from '@/lib/utils';
import { QuerySchema } from '@/query/search-query';

export default function useSearchQuery<T extends QuerySchema>(schema: T, additional?: Record<string, any>): z.infer<T> {
  const query = useSearchParams();
  const data = groupParamsByKey(query);

  return useMemo(() => {
    const result = schema.parse(data);

    if (additional) {
      return { ...additional, ...result };
    }

    return result;
  }, [additional, data, schema]);
}
