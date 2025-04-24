import Axios, { AxiosError } from 'axios';

import env from '@/constant/env';

class StatusError extends Error {
	constructor(
		public status: number,
		public message: string,
		public originalError: unknown,
	) {
		super(message);
		this.name = 'StatusError';
	}
}

function createApiError(error: AxiosError<any, { status: string; message: string }>) {
	return new StatusError(error.response?.data?.status, error.response?.data?.message, error);
}

function createNetworkError(error: unknown) {
	const message = !navigator?.onLine ? 'You are offline' : 'Network error';
	return new StatusError(503, message, error);
}

function createServiceError(error: unknown) {
	return new StatusError(503, 'Service is unavailable, please try again later', error);
}

function createAxiosError(error: AxiosError) {
	return new StatusError(error.status ?? 500, `Axios error: ${error?.message}`, error);
}

function createUnknownError(error: unknown) {
	return new StatusError(500, `An unknown error occurred: ${(error as Error).message}`, error);
}

function logError(error: unknown) {
	console.log(
		JSON.stringify(
			error,
			Object.getOwnPropertyNames(error as object).filter((field) => field !== 'stack'),
		),
	);
}

const axiosInstance = Axios.create({
	baseURL: env.url.api,
	timeout: env.requestTimeout,
	paramsSerializer: {
		indexes: null,
	},
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(res) => res,
	(error) => {
		logError(error);

		if (error?.message) {
			return Promise.reject(error?.message);
		}

		let statusError: StatusError;

		if (error?.response?.data) {
			statusError = createApiError(error);
		} else if (error.errno === -4078) {
			statusError = createServiceError(error);
		} else if ('code' in error && error.code === 'ERR_NETWORK') {
			statusError = createNetworkError(error);
		} else if (Axios.isAxiosError(error)) {
			statusError = createAxiosError(error);
		} else {
			statusError = createUnknownError(error);
		}

		return Promise.reject(statusError);
	},
);

export default axiosInstance;
