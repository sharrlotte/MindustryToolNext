import cfg from '@/constant/global';
import { sortSchema } from '@/schema/schema';
import { z } from 'zod';

interface GetSchematicParams {
	page: number;
	name: string | null;
	authorId: string | null;
	tags: string[];
	sort: string;
}

export default function getSchematics(params: GetSchematicParams) {
	const schema = z.object({
		page: z
			.number()
			.gte(0)
			.transform((value) => `${value}`),
		name: z.string().default(''),
		authorId: z.string().default(''),
		tags: z.array(z.string()),
		sort: sortSchema,
	});

	const { page, name, authorId, tags, sort } = schema.parse(params);

	return fetch(
		cfg.apiUrl +
			new URLSearchParams({
				page,
				name,
				authorId,
				tags : tags,
				sort,
			})
	);
}
