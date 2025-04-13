import { AxiosInstance } from 'axios';

import { PaginationQuery } from '@/query/search-query';
import { ImageMetadata } from '@/types/response/FileMetadata';

export interface ImageUploadRequest {
	file: File;
	folder: string;
	id: string;
	format: string;
}

export async function uploadImage(axios: AxiosInstance, { file, folder, id, format }: ImageUploadRequest): Promise<void> {
	const form = new FormData();
	form.append('file', file);

	return axios.post('/images', form, {
		data: form,
		params: {
			folder,
			id,
			format,
		},
	});
}

export async function deleteImage(axios: AxiosInstance, path: string): Promise<void> {
	const result = await axios.delete(`/images`, { params: { path } });
	return result.data;
}

export async function getImages(axios: AxiosInstance, params: PaginationQuery & { path?: string }): Promise<ImageMetadata[]> {
	const result = await axios.get('/images', {
		params,
	});

	return result.data;
}
