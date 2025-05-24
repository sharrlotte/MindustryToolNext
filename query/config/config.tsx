import Axios from 'axios';

import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import { uuid } from '@/lib/utils';

function logError(error: unknown) {
	console.error(JSON.stringify(error));
}

const axiosInstance = Axios.create({
	baseURL: env.url.api,
	timeout: env.requestTimeout,
	paramsSerializer: {
		indexes: null,
	},
	withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
	if (process.env.NODE_ENV !== 'production') {
		const id = uuid();
		config.headers['x-request-id'] = uuid();
		console.log(`${id} ${config.method?.toUpperCase()} ${config.url}`);
	}

	return config;
});

axiosInstance.interceptors.response.use(
	(res) => {
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
			console.error(e);
		}
		if (error?.response?.data?.message) {
			return Promise.reject(error.response.data.message);
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
