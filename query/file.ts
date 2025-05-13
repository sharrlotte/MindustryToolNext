import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';
import { ServerFile } from '@/types/response/ServerFile';

export async function deleteServerFile(axios: AxiosInstance, path: string): Promise<void> {
	const result = await axios.delete(`/files`, {
		params: { path },
	});

	return result.data;
}

export async function getServerFiles(axios: AxiosInstance, path: string): Promise<ServerFile[]> {
	const result = await axios.get(`/files`, {
		params: { path },
	});

	return result.data;
}

type UploadServerFile =
	| {
			file: File;
	  }
	| {
			name: string;
	  };

export async function createServerFile(axios: AxiosInstance, path: string, body: UploadServerFile): Promise<void> {
	const form = toForm(body);

	return axios.post(`/files`, form, {
		params: { path },
		data: form,
		timeout: 1000 * 60 * 60,
	});
}
