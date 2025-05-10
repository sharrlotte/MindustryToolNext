import { TagType } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import { groupBy } from '@/lib/utils';
import { getTags } from '@/query/tag';
import { Mod } from '@/types/response/Mod';
import TagGroup, { AllTagGroup } from '@/types/response/TagGroup';

import { useQueries } from '@tanstack/react-query';

export default function useTags(type: TagType, mod: Mod[]): TagGroup[]  {
	const axios = useClientApi();

	const queries = useQueries({
		queries: [
			{
				queryKey: ['tags'],
				queryFn: async () => getTags(axios),
			},
			...mod.map((v) => {
				return {
					queryKey: ['tags', v.id],
					queryFn: async () => getTags(axios, v.id),
				};
			}),
		],
	});

	return groupBy(
		queries.flatMap((query) => validateTags(query.data, type)),
		(v) => v.name,
	).flatMap(({ value }) => ({ ...value[0], values: value.flatMap((v) => v.values) }));
}

function validateTags(data: AllTagGroup | undefined, type: TagType): TagGroup[] {
	const result = data && type in data ? data[type]?.filter((v) => v.values.length > 0) : [];

	return result ?? [];
}
