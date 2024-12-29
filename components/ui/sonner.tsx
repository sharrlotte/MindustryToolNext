'use client';

import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import { Toaster as Sonner } from 'sonner';
import { toast as defaultToast } from 'sonner';

import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from '@/components/common/icons';

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
} & Record<string, any>;

function toast(title: ReactNode, options?: ToastOptions) {
  if (options?.description) {
    return defaultToast(
      <div className="grid text-base">
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

  defaultToast(<div className="flex">{title}</div>, options);
}

toast.success = (title: ReactNode, options?: ToastOptions) => {
  toast(title, { icon: <CheckCircleIcon className="size-4" />, ...options });
};

toast.error = (title: ReactNode, options?: ToastOptions) => {
  toast(title, { icon: <XCircleIcon className="size-4" />, ...options });
};

toast.warning = (title: ReactNode, options?: ToastOptions) => {
  toast(title, { icon: <AlertTriangleIcon className="size-4" />, ...options });
};

toast.dismiss = (id: number | string) => {
  return defaultToast.dismiss(id);
};

type PromiseToastOption<T> = {
  loading?: ReactNode;
  success?: (data: T) => ReactNode | ReactNode;
  error?: (error: T) => ReactNode | ReactNode;
};

function promise<T>(promise: Promise<T>, options: PromiseToastOption<T>) {
  defaultToast.promise(promise, options);
}

toast.promise = promise;

export { Toaster, toast };
