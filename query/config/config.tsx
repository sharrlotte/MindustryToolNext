import Axios from 'axios';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import { hasProperty } from '@/lib/utils';

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
			} else if (hasProperty(error, 'response') && hasProperty(error.response, 'status')) {
				const status = error.response.status;
				const message = error.response.data.message;

				if (status === 400) {
					toast.error(<Tran text="bad-request" />, {
						description: message,
					});
				} else if (status === 401) {
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

		console.log(error);

		if (error?.response?.data?.message) {
			return Promise.reject(error.response.data.message);
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
