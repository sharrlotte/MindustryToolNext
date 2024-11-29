import { AxiosInstance } from 'axios';
import { z } from 'zod';

import { toForm } from '@/lib/utils';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { Comment } from '@/types/response/Comment';

export async function getComments(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<Comment[]> {
  const result = await axios.get(`/items/${id}/comments`, {
    params,
  });

  return result.data;
}

export const CreateCommentSchema = z.object({
  content: z.string().min(1).max(1024),
  attachments: z
    .array(z.object({ url: z.string().min(5).max(100), file: z.any().nullable() }))
    .min(0)
    .max(5)
    .default([]),
});

export type CreateCommentSchemaType = z.infer<typeof CreateCommentSchema>;

export async function createComment(axios: AxiosInstance, itemId: string, { content, attachments, ...rest }: CreateCommentSchemaType) {
  const form = toForm(rest);

  form.append('content', content);

  attachments.filter(({ file }) => !!file).forEach(({ file, url }) => form.append('files', file as File, url));

  return await axios.post(`/items/${itemId}/comments`, form, {
    data: form,
  });
}
