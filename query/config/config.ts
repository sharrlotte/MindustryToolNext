import Axios from 'axios';

import env from '@/constant/env';

function logError(error: unknown) {
	try {
		console.log(
			JSON.stringify(
				error,
				Object.getOwnPropertyNames(error as object).filter((field) => field !== 'stack'),
			),
		);
	} catch (e) {
		console.error(error);
		console.error(e);
	}
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

		return Promise.reject(error);
	},
);

export default axiosInstance;
