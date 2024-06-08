import { z } from 'zod';

export type PostPluginRequest = {
  name: string;
  description: string;
  tags: string;
  url: string;
};

export const PostPluginRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(100),
  tags: z
    .array(
      z.object({
        name: z.string(),
        value: z.array(z.string()),
        color: z.string(),
        duplicate: z.boolean(),
      }),
    )
    .min(1),
  url: z
    .string()
    .regex(
      /https:\/\/github.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)/,
      'Invalid GitHub URL',
    ),
});

export type PostPluginRequestData = z.infer<typeof PostPluginRequestSchema>;
