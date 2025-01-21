'use client';

import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import { Toaster as Sonner, toast as defaultToast } from 'sonner';

import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon, XIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/router-spinner';

import { cn } from '@/lib/utils';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group border-none"
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'group p-0 border-none group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      offset={16}
      duration={process.env.NODE_ENV === 'development' ? 100000 : undefined}
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
  if (options?.description) {
    const id = defaultToast(
      <div className={cn('grid text-base border-none w-full rounded-lg p-4 relative', options.className)}>
        <div className="size-4 absolute top-2 right-2 text-white cursor-pointer" onClick={() => defaultToast.dismiss(id)}>
          <XIcon className="size-4" />
        </div>
        <div className="flex gap-1 items-center">
          {options.icon}
          {title}
        </div>
        <div className="text-muted-foreground text-sm">{options.description}</div>
      </div>,
      {
        duration: 100000,
      },
    );

    return id;
  }

  const id = defaultToast(
    <div className={cn('relative grid text-sm border-none w-full rounded-lg p-4', options?.className)}>
      <div className="size-4 absolute top-2 right-2 text-white cursor-pointer" onClick={() => defaultToast.dismiss(id)}>
        <XIcon className="size-4" />
      </div>
      {title}
    </div>,
    options,
  );

  return id;
}

toast.success = (title: ReactNode, options?: ToastOptions) => {
  return toast(title, { icon: <CheckCircleIcon className="size-4" />, className: 'text-success bg-success/30', ...options });
};

toast.error = (title: ReactNode, options?: ToastOptions) => {
  return toast(title, { icon: <XCircleIcon className="size-4" />, className: 'text-destructive bg-destructive/20', ...options });
};

toast.warning = (title: ReactNode, options?: ToastOptions) => {
  return toast(title, { icon: <AlertTriangleIcon className="size-4" />, className: 'text-warning bg-warning/30', ...options });
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
