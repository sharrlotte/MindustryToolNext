import Axios from 'axios';

import { toast } from '@/components/ui/sonner';

import { isClient } from '@/constant/constant';
import env from '@/constant/env';
import { uuid } from '@/lib/utils';

const axiosInstance = Axios.create({
	baseURL: env.url.api,
	timeout: env.requestTimeout,
	paramsSerializer: {
		indexes: null,
	},
	withCredentials: true,
});

if (process.env.NODE_ENV !== 'production') {
	axiosInstance.interceptors.request.use((config) => {
		const id = uuid();
		config.headers['x-request-id'] = uuid().substring(0, 5);
		config.headers['x-request-start'] = Date.now();

		console.log(`${id} ${config.method?.toUpperCase()} ${config.url}`);

		return config;
	});

	axiosInstance.interceptors.response.use((res) => {
		if (res.headers['x-request-id']) {
			const id = res.headers['x-request-id'];
			const start = res.headers['x-request-start'];
			const end = Date.now();

			console.log(`${id} [${res.status}] ${res.config.method?.toUpperCase()} ${end - start}ms ${res.config.url}`);
		}

		return res;
	});
}

axiosInstance.interceptors.response.use(
	(res) => res,
	(error) => {
		if (isClient) {
			if (typeof error === 'string') {
				toast.error(error);
			}
		}
		if (error?.response?.data?.message) {
			return Promise.reject(error.response.data.message);
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
