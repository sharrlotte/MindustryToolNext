import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  content: z.string().min(1).max(10000),
});

export type CreateDocumentRequest = z.infer<typeof CreateDocumentSchema>;
