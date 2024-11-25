import { AxiosInstance } from 'axios';
import { z } from 'zod';

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
  attachments: z.array(z.string().min(5).max(100)).min(0).max(5).default([]),
});

export type CreateCommentSchemaType = z.infer<typeof CreateCommentSchema>;

export async function createComment(axios: AxiosInstance, itemId: string, data: CreateCommentSchemaType) {
  const result = await axios.post(`/items/${itemId}/comments`, data, { data });

  return result.data;
}
