import { z } from 'zod/v4';

export const ImageMetadataSchema = z.object({
	name: z.string(),
	path: z.string(),
	size: z.number(),
	modTime: z.string(),
	isDir: z.boolean(),
});

export type ImageMetadata = z.infer<typeof ImageMetadataSchema>;
