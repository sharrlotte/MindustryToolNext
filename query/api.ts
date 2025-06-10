import { AxiosInstance } from 'axios';

import { ErrorStatus } from '@/constant/constant';
import { ErrorReport } from '@/types/response/ErrorReport';
import { PaginationQuery } from '@/types/schema/search-query';

export async function reportErrorToBackend(axios: AxiosInstance, message: string) {
	try {
		const result = await axios.post('/error', { message });

		return result.data;
	} catch {
		// Ignore
	}
}

export async function getError(
	axios: AxiosInstance,
	params: PaginationQuery & { status?: ErrorStatus[] },
): Promise<ErrorReport[]> {
	const result = await axios.get('/error-report', { params });

	return result.data;
}

export async function updateErrorStatus(axios: AxiosInstance, id: string, status: ErrorStatus) {
	const result = await axios.put(`/error-report/${id}`, status, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return result.data;
}
