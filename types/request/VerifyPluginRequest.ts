import { z } from 'zod';

export const VerifyPluginSchema = z.object({
  tags: z
    .array(
      z.object({
        name: z.string(),
        values: z.array(z.object({ name: z.string() })),
        color: z.string(),
        duplicate: z.boolean(),
      }),
    )
    .min(1),
});

export type VerifyPluginRequestData = z.infer<typeof VerifyPluginSchema>;

type VerifyPluginRequest = {
  id: string;
  tags: string[];
};

export default VerifyPluginRequest;
