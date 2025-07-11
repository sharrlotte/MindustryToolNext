import { AxiosInstance } from 'axios';



import SchematicPreviewRequest from '@/types/request/SchematicPreviewRequest';
import VerifySchematicRequest from '@/types/request/VerifySchematicRequest';
import { Schematic } from '@/types/response/Schematic';
import { SchematicDetail } from '@/types/response/SchematicDetail';
import { SchematicPreviewResponse } from '@/types/response/SchematicPreviewResponse';
import { TagGroups } from '@/types/response/TagGroup';
import { CountItemPaginationQueryType, ItemPaginationQueryType } from '@/types/schema/search-query';
import { TAG_GROUP_SCHEMA } from '@/types/schema/zod-schema';



import { z } from 'zod/v4';


export async function getSchematicCount(axios: AxiosInstance, params: CountItemPaginationQueryType): Promise<number> {
	const result = await axios.get('/schematics/total', { params });

	return result.data;
}

export async function getSchematicPreview(
	axios: AxiosInstance,
	{ data }: SchematicPreviewRequest,
): Promise<SchematicPreviewResponse> {
	const form = new FormData();

	if (typeof data === 'string') {
		form.append('code', data);
	} else if (data instanceof File) {
		form.append('file', data);
	} else {
		throw new Error('Invalid data');
	}

	const result = await axios.post('/schematics/preview', form, {
		data: form,
		timeout: 300000,
	});

	return result.data;
}

export async function deleteSchematic(axios: AxiosInstance, id: string): Promise<void> {
	const result = await axios.delete(`/schematics/${id}`);

	return result.data;
}

export async function getSchematicData(axios: AxiosInstance, id: string): Promise<string> {
	const result = await axios.get(`/schematics/${id}/data`);

	return result.data;
}

export async function getSchematicUpload(axios: AxiosInstance, { id }: { id: string }): Promise<SchematicDetail> {
	const result = await axios.get(`/schematics/upload/${id}`);
	return result.data;
}

export async function getSchematicUploads(axios: AxiosInstance, params: ItemPaginationQueryType): Promise<Schematic[]> {
	const result = await axios.get('/schematics/upload', {
		params,
	});

	return result.data;
}

export async function getSchematic(axios: AxiosInstance, { id }: { id: string }): Promise<SchematicDetail> {
	const result = await axios.get(`/schematics/${id}`);
	return result.data;
}

export async function getSchematics(axios: AxiosInstance, params: ItemPaginationQueryType): Promise<Schematic[]> {
	const result = await axios.get('/schematics', {
		params,
	});

	return result.data;
}

export async function getSchematicUploadCount(
	axios: AxiosInstance,
	params: Omit<ItemPaginationQueryType, 'page' | 'size'>,
): Promise<number> {
	const result = await axios.get('/schematics/upload/total', {
		params,
	});

	return result.data;
}

export const CreateSchematicSchema = z.object({
	name: z.string().min(1).max(128),
	description: z.string().max(1024),
	data: z.any(),
	tags: TAG_GROUP_SCHEMA,
});

export type CreateSchematicRequest = z.infer<typeof CreateSchematicSchema>;

export async function createSchematic(
	axios: AxiosInstance,
	{ data, tags, name, description }: CreateSchematicRequest,
): Promise<void> {
	const form = new FormData();

	if (typeof data === 'string') {
		form.append('code', data);
	} else if (data instanceof File) {
		form.append('file', data);
	}
	form.append('tags', TagGroups.toString(tags));
	form.append('name', name);
	form.append('description', description ?? '');

	return axios.post('/schematics', form, {
		data: form,
		timeout: 300000,
	});
}

export async function verifySchematic(axios: AxiosInstance, { id, tags }: VerifySchematicRequest): Promise<void> {
	const data = { tags };

	return axios.post(`/schematics/${id}/verify`, data, {
		data,
	});
}

export async function unverifySchematic(axios: AxiosInstance, id: string): Promise<string> {
	const result = await axios.put(`/schematics/${id}`);

	return result.data;
}
