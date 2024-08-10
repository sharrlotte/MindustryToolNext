'use client';

import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import Tran from '@/components/common/tran';

export default function ErrorScreen({
  reset,
  error,
}: {
  error: Error & { digest?: string } & any;
  reset: () => void;
}) {
  const message = error.message ?? 'Something went wrong!';

  if (message === 'NEXT_NOT_FOUND') {
    throw notFound();
  }

  const t = useI18n();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h2 className="text-base">{message}</h2>
      <div className="grid items-center justify-center gap-2">
        <Button title={t('try-again')} onClick={() => reset()}>
          <Tran text="try-again" />
        </Button>
        <Button title={t('refresh')} onClick={() => window.location.reload()}>
          <Tran text="refresh" />
        </Button>
        <a
          className="text-lg text-brand hover:text-brand"
          href="https://discord.gg/DCX5yrRUyp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Tran text="report-error-at" />
        </a>
      </div>
    </div>
  );
}
