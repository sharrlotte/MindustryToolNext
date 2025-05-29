import { AxiosInstance } from 'axios';

import { ImageMetadata } from '@/types/response/FileMetadata';
import { PaginationQuery } from '@/types/schema/search-query';

export interface ImageUploadRequest {
	file: File;
	folder: string;
	id: string;
	format: string;
	onUploadProgress: (AxiosProgressEvent: any) => void;
}

export async function uploadImage(
	axios: AxiosInstance,
	{ file, folder, id, format, onUploadProgress }: ImageUploadRequest,
): Promise<void> {
	const form = new FormData();
	form.append('file', file);

	return axios.post('/images', form, {
		data: form,
		params: {
			folder,
			id,
			format,
		},
		onUploadProgress,
	});
}

export interface MediaUploadRequest {
	file: File;
	id: string;
	format: string;
	onUploadProgress: (AxiosProgressEvent: any) => void;
}

export async function uploadMedia(
	axios: AxiosInstance,
	{ format, file, id, onUploadProgress }: MediaUploadRequest,
): Promise<string> {
	const form = new FormData();
	form.append('file', file);

	return axios
		.post('/images/media', form, {
			data: form,
			params: {
				id,
				format,
			},
			onUploadProgress,
		})
		.then((res) => res.data as string);
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
