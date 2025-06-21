'use client';

import { AxiosInstance } from 'axios';
import { useEffect } from 'react';

import { DEFAULT_PAGINATION_SIZE, PAGINATION_SIZE_PERSISTENT_KEY, isClient } from '@/constant/constant';
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
	useEffect(() => {
		const id = axiosInstance.interceptors.request.use(async (config) => {
			const params = config.params;

			if (!params || !('size' in params) || 'autoSize' in params) {
				return config;
			}

			if (isClient) {
				config.params['size'] = getCookie(PAGINATION_SIZE_PERSISTENT_KEY) ?? DEFAULT_PAGINATION_SIZE;
			}

			return config;
		});

		return () => {
			axiosInstance.interceptors.request.eject(id);
		};
	}, []);

	return axiosInstance;
}
