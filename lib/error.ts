import { isAxiosError } from 'axios';
import { notFound } from 'next/navigation';

import { reportErrorToBackend } from '@/query/api';
import axiosInstance from '@/query/config/config';

export function reportError(error: any) {
	reportErrorToBackend(axiosInstance, getLoggedErrorMessage(error));
}

export type TError =
	| Error
	| { error: { message: string; name?: string } | Error }
	| string
	| { message: string; name?: string }
	| {
			response: {
				data: {
					status: number;
					message: string;
				};
			};
	  };
export type ApiError = {
	error: any;
};

const DEFAULT_NEXTJS_ERROR_MESSAGE =
	'An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details. A digest property is included on this error instance which may provide additional details about the nature of the error.';

const INTERNAL_ERROR_MESSAGE = 'Request failed with status code 500';

export function getErrorMessage(error: TError) {
	if (!error) {
		return 'Something is wrong';
	}

	if (typeof error === 'string') {
		return error;
	}

	if ('response' in error) {
		if (error.response?.data?.message) {
			return error.response?.data?.message;
		}
	}

	if ('error' in error) {
		return getErrorMessage(error.error);
	}

	if ('message' in error) {
		if (error?.message === DEFAULT_NEXTJS_ERROR_MESSAGE) return '500 Internal server error';

		if (error?.message === INTERNAL_ERROR_MESSAGE) return '500 Internal server error';

		return error?.message;
	}

	return 'Something is wrong';
}

export function getLoggedErrorMessage(error: TError) {
	try {
		if (!error) {
			return 'Something is wrong';
		}

		if (typeof error === 'string') {
			return error;
		}

		if ('error' in error) {
			return getLoggedErrorMessage(error.error);
		}

		if ('response' in error) {
			if (error.response?.data?.message) {
				return error.response?.data?.message;
			}
		}

		if (typeof window !== 'undefined') {
			if (typeof error === 'object' && 'name' in error && error.name === 'ChunkLoadError') {
				const reloadAttemps = localStorage.getItem('RELOAD_ATTEMPTS');

				if (reloadAttemps && parseInt(reloadAttemps) < 3) {
					localStorage.setItem('RELOAD_ATTEMPTS', '' + (parseInt(reloadAttemps) + 1));
					window.location.reload();
				}
			}
		}

		if (isAxiosError(error)) {
			return JSON.stringify({
				request: JSON.stringify(error.request),
				response: JSON.stringify(error.response),
				config: JSON.stringify(error.config, Object.keys(error.config ?? {})),
				url: error.config?.url,
				stacktrace: error.stack,
				message: error?.message,
			});
		}

		return JSON.stringify(error, Object.getOwnPropertyNames(error));
	} catch (e) {
		return JSON.stringify(error, Object.getOwnPropertyNames(error));
	}
}

export function isError<T extends Record<string, any> | number>(req: T | ApiError | null): req is ApiError {
	if (
		req &&
		typeof req === 'object' &&
		'error' in req &&
		typeof req.error === 'object' &&
		'status' in req.error &&
		req.error.status === 404
	)
		notFound();

	const isError = !!req && typeof req === 'object' && 'error' in req;

	if (isError) {
		try {
			reportError(req);
		} catch (e) {
			console.error(e);
		}
	}

	return isError;
}
