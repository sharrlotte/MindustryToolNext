import { TAG_GROUP_SCHEMA } from '@/types/schema/zod-schema';



import { z } from 'zod/v4';

export type CreatePluginRequest = {
	name: string;
	description: string;
	tags: string[];
	url: string;
};

export const CreatePluginSchema = z
	.object({
		name: z.string().min(1).max(100),
		description: z.string().min(1).max(100),
		tags: TAG_GROUP_SCHEMA,
		url: z.string().regex(/https:\/\/github.com\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_]+)/, 'Invalid GitHub URL'),
		isPrivate: z.boolean(),
		bearerToken: z.string().optional(),
	})
	.refine((args) => args.isPrivate === false || (args.isPrivate && args.bearerToken && args.bearerToken.length > 0), {
		message: 'Github bearer token is required for private authentication',
		path: ['bearerToken'],
	});

export type CreatePluginRequestData = z.infer<typeof CreatePluginSchema>;
