'use client';

import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import { Toaster as Sonner, toast as defaultToast } from 'sonner';

import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon, XIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/loading-spinner';
import Tran from '@/components/common/tran';

import { getErrorMessage, TError } from '@/lib/error';
import { cn, hasProperty } from '@/lib/utils';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className="toaster group p-4 m-1"
			style={{
				gap: 6,
			}}
			toastOptions={{
				classNames: {
					toast: 'group p-0 group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
					description: 'group-[.toast]:text-muted-foreground',
					actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
					cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
				},
			}}
			{...props}
		/>
	);
};

type ToastOptions = {
	description?: ReactNode;
	icon?: ReactNode;
	className?: string;
} & Record<string, any>;

function toast(title: ReactNode, options?: ToastOptions) {
	const id = defaultToast(
		<div className={cn('grid text-base text-foreground w-full rounded-lg relative p-4 bg-card border-card', options?.className)}>
			<div className="size-4 absolute top-2 right-2 cursor-pointer" onClick={() => defaultToast.dismiss(id)}>
				<XIcon className="size-4" />
			</div>
			<div className="flex gap-1 items-center">
				{options?.icon && options.icon}
				{title ?? 'Unexpected error'}
			</div>
			{options?.description && <div className="text-muted-foreground text-sm">{options.description}</div>}
		</div>,
		{
			...options,
			duration: process.env.NODE_ENV === 'development' ? 100000 : 5000,
		},
	);

	return id;
}

toast.success = (title: ReactNode, options?: ToastOptions) => {
	return toast(title, {
		icon: <CheckCircleIcon className="size-4" />,
		className: 'text-success-foreground bg-success border-success',
		...options,
	});
};

toast.error = (
	title: ReactNode,
	options?: ToastOptions & {
		error?: TError;
	},
) => {
	
	if (options?.error) {
		return toast(title, {
			icon: <XCircleIcon className="size-4" />,
			className: 'text-destructive-foreground bg-destructive border-destructive',
			...options,
			description: getErrorMessage(options.error),
		});
	}

	return toast(title, {
		icon: <XCircleIcon className="size-4" />,
		className: 'text-destructive-foreground bg-destructive border-destructive',
		...options,
	});
};

const httpStatusMessage: {
	[status: number]: string;
} = {
	400: 'bad-request',
	401: 'unauthorized',
	403: 'forbidden',
	404: 'not-found',
	409: 'conflict',
	422: 'unprocessable-entity',
	429: 'too-many-requests',
	500: 'internal-server-error',
	502: 'bad-gateway',
};

toast.httpError = (error: any, options?: Omit<ToastOptions, 'description'>) => {
	if (hasProperty(error, 'response') && hasProperty(error.response, 'status')) {
		const status = error.response.status as number;
		const message = error.response.data.message;

		const statusMessage = httpStatusMessage[status] ?? 'unknown';

		return toast.error(<Tran text={statusMessage} />, {
			description: message,
		});
	}

	return toast.error(<Tran text="error" />, {
		description: JSON.stringify(error),
		...options,
	});
};

toast.warning = (title: ReactNode, options?: ToastOptions) => {
	return toast(title, {
		icon: <AlertTriangleIcon className="size-4" />,
		className: 'text-warning-foreground bg-warning border-warning',
		...options,
	});
};

toast.loading = (title: ReactNode, options?: ToastOptions) => {
	return toast(title, { icon: <LoadingSpinner className="size-4 p-0" />, ...options });
};

toast.dismiss = (id?: number | string) => {
	return defaultToast.dismiss(id);
};

type O = {
	title: ReactNode;
	description: ReactNode;
};

type PromiseToastOption<T> = {
	loading?: (() => ReactNode) | (() => O) | ReactNode;
	success?: ((data: T) => ReactNode) | ((data: T) => O) | ReactNode;
	error?: ((error: any) => ReactNode) | ((error: any) => O) | ReactNode;
};

async function promise<T>(promise: Promise<T>, options: PromiseToastOption<T>) {
	let id: any;
	if (options.loading && typeof options.loading === 'function') {
		const r = options.loading();

		if (r && typeof r === 'object' && 'title' in r) {
			id = toast.loading(r.title, { description: r.description, id });
		} else {
			id = toast.loading(r, { id });
		}
	}

	await promise
		.then((result) => {
			if (options.success && typeof options.success === 'function') {
				const r = options.success(result);

				if (r && typeof r === 'object' && 'title' in r) {
					toast.success(r.title, { description: r.description, id });
				} else {
					toast.success(r, { id });
				}
			} else {
				toast.success(options.success, { id });
			}
		})
		.catch((error) => {
			if (options.error && typeof options.error === 'function') {
				const r = options.error(error);

				if (r && typeof r === 'object' && 'title' in r) {
					toast.error(r.title, { description: r.description, id });
				} else {
					toast.error(r, { id });
				}
			} else {
				toast.error(options.error, { id });
			}
		});

	return id;
}

toast.promise = promise;

export { Toaster, toast };
