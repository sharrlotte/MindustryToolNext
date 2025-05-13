import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';
import MapPreviewRequest from '@/types/request/MapPreviewRequest';
import VerifyMapRequest from '@/types/request/VerifyMapRequest';
import { Map } from '@/types/response/Map';
import { MapDetail } from '@/types/response/MapDetail';
import { MapPreviewResponse } from '@/types/response/MapPreviewResponse';
import { TagGroups } from '@/types/response/TagGroup';
import { CountItemPaginationQueryType, ItemPaginationQueryType } from '@/types/schema/search-query';
import { CreateMapRequest } from '@/types/schema/zod-schema';

export async function getMapCount(axios: AxiosInstance, params: CountItemPaginationQueryType): Promise<number> {
	const result = await axios.get('/maps/total', { params });

	return result.data;
}

export async function deleteMap(axios: AxiosInstance, id: string): Promise<void> {
	const result = await axios.delete(`/maps/${id}`);

	return result.data;
}

export async function getMapData(axios: AxiosInstance, id: string): Promise<string> {
	const result = await axios.get(`/maps/${id}/data`);

	return result.data;
}

export async function getMapUpload(axios: AxiosInstance, { id }: { id: string }): Promise<MapDetail> {
	const result = await axios.get(`/maps/upload/${id}`);
	return result.data;
}

export async function getMapUploads(axios: AxiosInstance, params: ItemPaginationQueryType): Promise<Map[]> {
	const result = await axios.get('/maps/upload', {
		params,
	});

	return result.data;
}

export async function getMap(axios: AxiosInstance, { id }: { id: string }): Promise<MapDetail> {
	const result = await axios.get(`/maps/${id}`);
	return result.data;
}

export async function getMaps(axios: AxiosInstance, params: ItemPaginationQueryType): Promise<Map[]> {
	const result = await axios.get('/maps', {
		params,
	});

	return result.data;
}

export async function getMapUploadCount(axios: AxiosInstance, params: Omit<ItemPaginationQueryType, 'page' | 'size'>): Promise<number> {
	const result = await axios.get('/maps/upload/total', {
		params,
	});

	return result.data;
}
export async function getMapPreview(axios: AxiosInstance, { file }: MapPreviewRequest): Promise<MapPreviewResponse> {
	const form = new FormData();

	form.append('file', file);

	const result = await axios.post('/maps/preview', form, {
		data: form,
		timeout: 300000,
	});

	return result.data;
}

export async function createMap(axios: AxiosInstance, { tags, ...data }: CreateMapRequest): Promise<void> {
	const form = toForm(data);

	form.append('tags', TagGroups.toString(tags));

	return axios.post('/maps', form, {
		data: form,
		timeout: 300000,
	});
}

export async function createMultipleMap(axios: AxiosInstance, { tags, ...data }: CreateMapRequest): Promise<void> {
	const form = toForm(data);

	form.append('tags', TagGroups.toString(tags));

	return await axios.post('/maps/multiple', form, {
		data: form,
	});
}

export async function verifyMap(axios: AxiosInstance, { id, tags }: VerifyMapRequest): Promise<void> {
	return axios.post(
		`/maps/${id}/verify`,
		{ tags },
		{
			data: { tags },
		},
	);
}

export async function unverifyMap(axios: AxiosInstance, id: string): Promise<string> {
	const result = await axios.put(`/maps/${id}`);

	return result.data;
}
