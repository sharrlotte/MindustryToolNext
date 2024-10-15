'use client';

import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Tran from '@/components/common/tran';
import { useEffect } from 'react';
import { reportError } from '@/query/api';
import useClientApi from '@/hooks/use-client';

export default function ErrorScreen({ error }: { error: (Error & { digest?: string }) | { error: { message: string } } }) {
  const path = usePathname();
  const axios = useClientApi();

  const message = (error && 'error' in error ? error.error.message : error.message) ?? 'Something went wrong!';

  useEffect(() => {
    reportError(axios, { message: JSON.stringify(error), path });
  }, [axios, path, error]);

  return (
    <div className="col-span-full row-span-full flex h-full w-full flex-col items-center justify-center gap-2 p-2">
      <h2 className="text-base font-bold">{message}</h2>
      <div className="grid grid-cols-2 items-center justify-center gap-2">
        <a className="h-9 flex-1 text-nowrap rounded-md bg-secondary px-2 py-1.5" href="https://discord.gg/DCX5yrRUyp" target="_blank" rel="noopener noreferrer">
          <Tran text="report-error-at" />
        </a>
        <Button className="flex-1" variant="primary" onClick={() => window.location.reload()}>
          <Tran text="refresh" />
        </Button>
      </div>
    </div>
  );
}
