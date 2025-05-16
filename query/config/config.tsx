import Axios from 'axios';

import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import { uuid } from '@/lib/utils';

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
	(res) => {
		if (process.env.NODE_ENV !== 'production') {
			console.timeEnd(`${res.config.headers['x-request-id']} ${res.config.method?.toUpperCase()} ${res.config.url}`);
		}
		return res;
	},
	(error) => {
		try {
			logError(error);

			if (typeof window !== 'undefined') {
				if (typeof error === 'string') {
					toast.error(error);
				}
			}
		} catch (e) {
			console.log(e);
		}
		if (error?.response?.data?.message) {
			return Promise.reject(error.response.data.message);
		}
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.request.use((config) => {
	if (process.env.NODE_ENV !== 'production') {
		const id = uuid();
		config.headers['x-request-id'] = uuid();
		console.time(`${id} ${config.method?.toUpperCase()} ${config.url}`);
	}

	return config;
});

export default axiosInstance;
