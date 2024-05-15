'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import { notFound } from 'next/navigation';

export default function ErrorScreen({
  reset,
  error,
}: {
  error: Error & { digest?: string } & any;
  reset: () => void;
}) {
  let message = error.message ?? 'Something went wrong!';

  if (message === 'NEXT_NOT_FOUND') {
    throw notFound();
  }

  const t = useI18n();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h2 className="text-base">{message}</h2>
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
