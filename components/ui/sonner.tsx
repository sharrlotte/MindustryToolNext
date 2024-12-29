'use client';

import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import { Toaster as Sonner } from 'sonner';
import { toast as defaultToast } from 'sonner';

import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/router-spinner';

import { cn } from '@/lib/utils';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      offset={16}
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
    return defaultToast(
      <div className={cn('grid text-base', options.className)}>
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
  }

  return defaultToast(<div className="flex">{title}</div>, options);
}

toast.success = (title: ReactNode, options?: ToastOptions) => {
  return toast(title, { icon: <CheckCircleIcon className="size-4" />, className: 'text-success bg-success/30', ...options });
};

toast.error = (title: ReactNode, options?: ToastOptions) => {
  return toast(title, { icon: <XCircleIcon className="size-4" />, className: 'text-destructive bg-destructive/30', ...options });
};

toast.warning = (title: ReactNode, options?: ToastOptions) => {
  return toast(title, { icon: <AlertTriangleIcon className="size-4" />, className: 'text-warning bg-warning/30',...options });
};

toast.loading = (title: ReactNode, options?: ToastOptions) => {
  return toast(title, { icon: <LoadingSpinner className="size-4 p-0" />, ...options });
};

toast.dismiss = (id: number | string) => {
  return defaultToast.dismiss(id);
};

type O = {
  title: ReactNode;
  description: ReactNode;
};

type PromiseToastOption<T> = {
  loading?: ReactNode;
  success?: ((data: T) => ReactNode) | ((data: T) => O) | ReactNode;
  error?: ((error: any) => ReactNode) | ((error: any) => O) | ReactNode;
};

function promise<T>(promise: Promise<T>, options: PromiseToastOption<T>) {
  const id = toast.loading(options.loading);

  promise
    .then((result) => {
      if (options.success && typeof options.success === 'function') {
        const r = options.success(result);

        if (r && typeof r === 'object' && 'title' in r) {
          toast.success(r.title, { description: r.description });
        } else {
          toast.success(r);
        }
      } else {
        toast.success(options.success);
      }
    })
    .catch((error) => {
      if (options.error && typeof options.error === 'function') {
        const r = options.error(error);

        if (r && typeof r === 'object' && 'title' in r) {
          toast.error(r.title, { description: r.description });
        } else {
          toast.error(r);
        }
      } else {
        toast.error(options.error);
      }
    })
    .finally(() => toast.dismiss(id));
}

toast.promise = promise;

export { Toaster, toast };
