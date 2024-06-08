import useSafeParam from '@/hooks/use-safe-param';
import { PathParams } from '@/query/config/search-query-params';
import { searchIdSchema } from '@/types/data/id-search-schema';

export default function useSearchId() {
  const safeParams = useSafeParam();
  const params = searchIdSchema.parse({
    id: safeParams.get(PathParams.id),
  });

  return params;
}
