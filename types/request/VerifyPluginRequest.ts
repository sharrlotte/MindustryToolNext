import { z } from 'zod';

export const VerifyPluginRequestSchema = z.object({
  tags: z
    .array(
      z.object({
        name: z.string(),
        values: z.array(z.string()),
        color: z.string(),
        duplicate: z.boolean(),
      }),
    )
    .min(1),
});

export type VerifyPluginRequestData = z.infer<typeof VerifyPluginRequestSchema>;

type VerifyPluginRequest = {
  id: string;
  tags: string[];
};

export default VerifyPluginRequest;
