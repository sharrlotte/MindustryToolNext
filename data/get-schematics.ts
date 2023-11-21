import cfg from '@/constant/global';
import { sortSchema } from '@/schema/schema';
import Schematic from '@/types/Schematic';
import { z } from 'zod';

export interface GetSchematicParams {
	page: number;
	name: string | null;
	authorId: string | null;
	tags: string[];
	sort: string;
}

export default async function getSchematics(params: GetSchematicParams): Promise<Schematic[]> {
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
		`${cfg.apiUrl}/schematics?` +
			new URLSearchParams({
				page,
				name,
				authorId,
				sort,
				tags: tags.join(','),
				items: '20',
			})
	).then((result) => result.json());
}
