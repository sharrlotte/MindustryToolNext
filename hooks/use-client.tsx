'use client';

import { AxiosInstance } from 'axios';
import { useEffect } from 'react';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import { DEFAULT_PAGINATION_SIZE, PAGINATION_SIZE_PERSISTENT_KEY } from '@/constant/constant';
import axiosInstance from '@/query/config/config';

function getCookie(name: string): string | null {
	const cookies = document.cookie.split('; ');
	for (const cookie of cookies) {
		const [key, value] = cookie.split('=');
		if (key === name) {
			return decodeURIComponent(value);
		}
	}
	return null;
}

export default function useClientApi(): AxiosInstance {
	axiosInstance.defaults.timeout = 60000;

	useEffect(() => {
		const id = axiosInstance.interceptors.request.use(async (config) => {
			const params = config.params;
			if (!params || !('size' in params) || 'autoSize' in params) {
				return config;
			}

			if (typeof window !== 'undefined') {
				config.params['size'] = getCookie(PAGINATION_SIZE_PERSISTENT_KEY) ?? DEFAULT_PAGINATION_SIZE;
			}

			return config;
		});

		return () => {
			axiosInstance.interceptors.request.eject(id);
		};
	}, []);

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			return;
		}

		const id = axiosInstance.interceptors.request.use(async (config) => {
			console.log(`CLIENT ${config.method?.toUpperCase()} ${config.baseURL}/${config.url}`);
			return config;
		});

		return () => {
			axiosInstance.interceptors.request.eject(id);
		};
	}, []);

	useEffect(() => {
		const id = axiosInstance.interceptors.response.use(
			async (response) => {
				return response;
			},
			(error) => {
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
				} else return Promise.reject(error);
			},
		);

		return () => {
			axiosInstance.interceptors.response.eject(id);
		};
	}, []);

	return axiosInstance;
}
