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

const map: Record<
	string,
	{
		start: number;
	}
> = {};

if (process.env.NODE_ENV !== 'production') {
	axiosInstance.interceptors.request.use((config) => {
		const id = `${config.method?.toUpperCase()} ${config.url}`;

		map[id] = {
			start: Date.now(),
		};

		return config;
	});

	axiosInstance.interceptors.response.use((res) => {
		const id = `${res.config.method?.toUpperCase()} ${res.config.url}`;

		if (id && map[id]) {
			const end = Date.now();
			const start = map[id].start;
			delete map[id];

			console.log(`[${res.status}] ${res.config.method?.toUpperCase()} ${end - start}ms ${res.config.url}`);
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
