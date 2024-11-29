import { useSearchParams } from 'next/navigation';
import { z } from 'zod';

import { QuerySchema } from '@/query/search-query';

const groupParamsByKey = (params: URLSearchParams) =>
  [...params.entries()].reduce<Record<string, any>>((acc, tuple) => {
    const [key, val] = tuple;
    if (Object.prototype.hasOwnProperty.call(acc, key)) {
      if (Array.isArray(acc[key])) {
        acc[key] = [...acc[key], val];
      } else {
        acc[key] = [acc[key], val];
      }
    } else {
      acc[key] = val;
    }

    return acc;
  }, {});

export default function useSearchQuery<T extends QuerySchema>(schema: T): z.infer<typeof schema> {
  const query = useSearchParams();
  const data = groupParamsByKey(query);

  const result = schema.parse(data);

  return result;
}
