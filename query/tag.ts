import { AxiosInstance } from 'axios';
import { z } from 'zod';

import { toForm } from '@/lib/utils';
import { TagDto } from '@/types/response/Tag';
import { AllTagGroup, TagCategoryDto, TagGroupDto } from '@/types/response/TagGroup';

export async function getTags(axios: AxiosInstance, modId?: string): Promise<AllTagGroup> {
  const { data } = await axios.get('/tags', { params: { modId } });
  return data;
}

export async function getTagCategories(axios: AxiosInstance): Promise<TagCategoryDto[]> {
  const { data } = await axios.get('/tags/categories');
  return data;
}

export async function getTagCategory(axios: AxiosInstance, id: number): Promise<TagCategoryDto> {
  const { data } = await axios.get(`/tags/categories/${id}`);

  return data;
}

export async function getTagGroup(axios: AxiosInstance): Promise<TagGroupDto[]> {
  const { data } = await axios.get('/tags/groups');
  return data;
}

export async function getTagDetail(axios: AxiosInstance, modId?: string): Promise<TagDto[]> {
  const { data } = await axios.get('/tags/detail', { params: { modId } });

  return data;
}

export async function createTag(axios: AxiosInstance, payload: CreateTagRequest): Promise<void> {
  const form = toForm(payload);

  const result = await axios.post(`/tags`, form, { data: form });

  return result.data;
}

export const CreateTagSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(100),
  categoryId: z.number().int(),
  modId: z.string().optional(),
  icon: z.any(),
});

export type CreateTagRequest = z.infer<typeof CreateTagSchema>;

export const UpdateTagSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(100),
  categoryId: z.number().int(),
  modId: z.string().optional().nullable(),
  icon: z.any(),
});

export type UpdateTagRequest = z.infer<typeof UpdateTagSchema>;

export async function updateTag(axios: AxiosInstance, id: string, payload: UpdateTagRequest): Promise<void> {
  const form = toForm(payload);

  const result = await axios.put(`/tags/${id}`, form, { data: form });

  return result.data;
}

export async function deleteTag(axios: AxiosInstance, id: string): Promise<void> {
  const result = await axios.delete(`/tags/${id}`);

  return result.data;
}
