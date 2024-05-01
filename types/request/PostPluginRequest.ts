import { z } from 'zod';

export type PostPluginRequest = {
  name: string;
  description: string;
  tags: string;
  file: File;
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
  file: z
    .instanceof(File)
    .refine(
      (file: File) => file.name.split('.').pop() === 'jar',
      'Invalid file extension',
    ),
});

export type PostPluginRequestData = z.infer<typeof PostPluginRequestSchema>;
