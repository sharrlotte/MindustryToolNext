'use client';

import { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';

export default function ErrorScreen({
  reset,
  error,
}: {
  error: Error & { digest?: string } & any;
  reset: () => void;
}) {
  let message = 'Something went wrong!';
  if (error instanceof AxiosError) {
    message = error.message;
  }

  const t = useI18n();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl capitalize">{message}</h2>
      <div className="grid items-center justify-center gap-2">
        <Button title={t('try-again')} onClick={() => reset()}>
          {t('try-again')}
        </Button>
        <Button title={t('refresh')} onClick={() => window.location.reload()}>
          {t('refresh')}
        </Button>
      </div>
    </div>
  );
}
