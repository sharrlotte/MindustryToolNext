import { useSearchParams } from 'next/navigation';
import { z } from 'zod';

import { QuerySchema } from '@/query/query';

export default function useSearchQuery<T extends QuerySchema>(
  schema: T,
): z.infer<typeof schema> {
  const query = useSearchParams();
  const data = Object.fromEntries(query.entries());

  const result = schema.parse(data);

  return result;
}
