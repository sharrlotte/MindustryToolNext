import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { z } from 'zod';

import useConfig from '@/hooks/use-config';
import { groupParamsByKey } from '@/lib/utils';
import { QuerySchema } from '@/types/schema/search-query';

export default function useSearchQuery<T extends QuerySchema>(schema: T, additional?: Record<string, any>): z.infer<T> {
	const { paginationSize } = useConfig();
	const query = useSearchParams();
	const data = groupParamsByKey(query);

	return useMemo(() => {
		const result = schema.parse(data);

		if (additional) {
			return { ...result, ...additional, size: paginationSize };
		}

		return result;
	}, [schema, additional, data, paginationSize]);
}
