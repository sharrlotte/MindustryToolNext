import env from '@/constant/env';

import { ZodError, z } from 'zod/v4';

export const errors: string[] = [];

export function reportError(error: any) {
	if (process.env.NODE_ENV === 'production') {
		try {
			fetch(`${env.url.api}/error`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: getLoggedErrorMessage(error) }),
			});
		} catch (error) {
			console.error('Fail to report error', error);
		}
	}
}

export class NotFoundError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'NotFoundError';
	}
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

export function getErrorMessage(error: TError) {
	errors.unshift(JSON.stringify(error));

	if (!error) {
		return 'Something is wrong';
	}

	if (typeof error === 'string') {
		return error;
	}

	if (error instanceof ZodError) {
		return z.prettifyError(error);
	}

	if (typeof error === 'object' && 'response' in error) {
		if (error.response?.data?.message) {
			return error.response?.data?.message;
		}
	}

	if ('error' in error) {
		return getErrorMessage(error.error);
	}

	if ('message' in error) {
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

		return JSON.stringify(error);
	} catch (e) {
		return JSON.stringify(e);
	}
}

const ignoredErrors = ['NotFoundError', 'NotAuthorizedError', 'NotAuthenticatedError'];

export function isError<T extends Record<string, any> | number>(req: T | Error | null): req is Error {
	const isError = req instanceof Error;

	if (isError && !ignoredErrors.includes(req.name)) {
		try {
			console.error('Request error: ' + req + ' ' + new Error().stack);
			reportError(req);
		} catch (e) {
			console.error('Fail to report error: ' + e);
		}
	}

	return isError;
}
