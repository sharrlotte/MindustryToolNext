import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  text: z.string().min(1).max(10000),
  metadata: z.any(),
});

export type CreateDocumentRequest = z.infer<typeof CreateDocumentSchema>;
