import { AxiosInstance } from 'axios';
import { z } from 'zod';

import { toForm } from '@/lib/utils';
import { PaginationQuery } from '@/query/search-query';
import { Comment } from '@/types/response/Comment';

export async function getComments(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<Comment[]> {
  const result = await axios.get(`/items/${id}/comments`, {
    params,
  });

  return result.data;
}

export async function getAllComments(axios: AxiosInstance, params: PaginationQuery): Promise<Comment[]> {
  const result = await axios.get(`/comments`, {
    params,
  });

  return result.data;
}

export async function getAllCommentCount(axios: AxiosInstance): Promise<number> {
  const result = await axios.get(`/comments/count`);

  return result.data;
}

export async function getCommentsById(axios: AxiosInstance, id: string, params: PaginationQuery): Promise<Comment[]> {
  const result = await axios.get(`/comments/${id}`, {
    params,
  });

  return result.data;
}

export async function deleteCommentById(axios: AxiosInstance, id: string): Promise<void[]> {
  const result = await axios.delete(`/comments/${id}`);

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

export type CreateCommentRequest = z.infer<typeof CreateCommentSchema>;

export async function createComment(axios: AxiosInstance, itemId: string, { content, attachments, ...rest }: CreateCommentRequest) {
  const form = toForm(rest);

  form.append('content', content);

  attachments.filter(({ file }) => !!file).forEach(({ file, url }) => form.append('attachments', file as File, url));

  return await axios.post(`/items/${itemId}/comments`, form, {
    data: form,
  });
}
