import { AxiosInstance } from 'axios';



import { toForm } from '@/lib/utils';
import { DetailTagDto } from '@/types/response/Tag';
import { AllTagGroup, TagCategoryDto, TagDetailDto, TagGroupDto } from '@/types/response/TagGroup';



import { z } from 'zod/v4';

export async function getTags(axios: AxiosInstance, modId?: string): Promise<AllTagGroup> {
	const { data } = await axios.get('/tags', { params: { modId } });
	return data;
}
export async function searchTags(axios: AxiosInstance, tags: string[]): Promise<DetailTagDto[]> {
	const { data } = await axios.get('/tags/search', { params: { tags } });
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

export async function getTagDetail(axios: AxiosInstance, modId?: string): Promise<TagDetailDto[]> {
	const { data } = await axios.get('/tags/detail', { params: { modId } });

	return data;
}

export async function createTag(axios: AxiosInstance, payload: CreateTagRequest): Promise<void> {
	const form = toForm(payload);

	const result = await axios.post(`/tags`, form, { data: form });

	return result.data;
}

const TAG_NAME_REGEX = new RegExp('[a-z0-9-]');

export const CreateTagSchema = z.object({
	name: z.string().min(1).max(100).trim().regex(TAG_NAME_REGEX),
	description: z.string().min(1).trim().max(100),
	categoryId: z.number().int(),
	modId: z.string().optional(),
	icon: z.any(),
});

export type CreateTagRequest = z.infer<typeof CreateTagSchema>;

export const UpdateTagSchema = z.object({
	name: z.string().min(1).max(100).trim().regex(TAG_NAME_REGEX),
	description: z.string().min(1).max(100).trim(),
	categoryId: z.number().int(),
	modId: z.string().optional().nullable(),
	icon: z.any().optional(),
});

export type UpdateTagRequest = z.infer<typeof UpdateTagSchema>;

export async function updateTag(axios: AxiosInstance, id: number, payload: UpdateTagRequest): Promise<void> {
	const form = toForm(payload);

	const result = await axios.put(`/tags/${id}`, form, { data: form });

	return result.data;
}

export async function deleteTag(axios: AxiosInstance, id: number): Promise<void> {
	const result = await axios.delete(`/tags/${id}`);

	return result.data;
}

// --------------------------

export async function createTagCategory(axios: AxiosInstance, payload: CreateTagCategoryRequest): Promise<void> {
	const result = await axios.post(`/tags/categories`, payload);

	return result.data;
}

export const CreateTagCategorySchema = z.object({
	name: z.string().min(1).max(100).trim().regex(TAG_NAME_REGEX),
	color: z.string().min(1).max(100).trim(),
	duplicate: z.boolean(),
});

export type CreateTagCategoryRequest = z.infer<typeof CreateTagCategorySchema>;

export const UpdateTagCategorySchema = z.object({
	name: z.string().min(1).max(100).trim().regex(TAG_NAME_REGEX),
	color: z.string().min(1).max(100).trim(),
	duplicate: z.boolean(),
});

export type UpdateTagCategoryRequest = z.infer<typeof UpdateTagCategorySchema>;

export async function updateTagCategory(axios: AxiosInstance, id: number, payload: UpdateTagCategoryRequest): Promise<void> {
	const result = await axios.put(`/tags/categories/${id}`, payload);

	return result.data;
}

export async function deleteTagCategory(axios: AxiosInstance, id: number): Promise<void> {
	const result = await axios.delete(`/tags/categories/${id}`);

	return result.data;
}

export async function createGroupInfo(axios: AxiosInstance, groupId: number, categoryId: number): Promise<void> {
	const result = await axios.post(`/tags/groups/${groupId}/${categoryId}`);

	return result.data;
}
export const UpdateTagGroupInfoSchema = z.object({
	position: z.number().int(),
});

export type UpdateTagGroupInfoRequest = z.infer<typeof UpdateTagGroupInfoSchema>;

export async function updateGroupInfo(
	axios: AxiosInstance,
	groupId: number,
	categoryId: number,
	payload: UpdateTagGroupInfoRequest,
): Promise<void> {
	const result = await axios.put(`/tags/groups/${groupId}/${categoryId}`, payload);

	return result.data;
}

export async function deleteGroupInfo(axios: AxiosInstance, categoryId: number, groupId: number): Promise<void> {
	const result = await axios.delete(`/tags/groups/${groupId}/${categoryId}`);

	return result.data;
}
