import { z } from 'zod';

export const PostDocumentRequestSchema = z.object({
  content: z.string().min(1).max(1000),
});

export type PostDocumentRequest = z.infer<typeof PostDocumentRequestSchema>;
