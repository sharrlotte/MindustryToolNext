'use client';

import { CheckCircleIcon, WarningIcon, XCircleIcon } from '@/components/common/icons';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';

import { useToast } from '@/hooks/use-toast';

export default function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="flex items-center justify-start gap-0.5 text-start">
                  {props.variant === 'success' && <CheckCircleIcon className="size-5" />}
                  {props.variant === 'destructive' && <XCircleIcon className="size-5" />}
                  {props.variant === 'warning' && <WarningIcon />}
                  {title}
                </ToastTitle>
              )}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
