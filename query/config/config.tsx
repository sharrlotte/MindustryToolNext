import Axios from 'axios';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

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

			if (typeof window !== 'undefined') {
				if (typeof error === 'string') {
					toast.error(error);
				} else if (typeof error === 'object' && 'status' in error) {
					const status = error.status;

					if (status === 401) {
						toast.error(<Tran text="unauthorized" />);
					} else if (status === 403) {
						toast.error(<Tran text="forbidden" />);
					} else if (status === 404) {
						toast.error(<Tran text="not-found" />);
					} else if (status === 409) {
						toast.error(<Tran text="conflict" />);
					} else if (status === 500) {
						toast.error(<Tran text="internal-server-error" />);
					}
				}
			}

			if (error?.response?.message){
				return Promise.reject(error.response.message);
			}
			return Promise.reject(error);
	},
);

export default axiosInstance;
