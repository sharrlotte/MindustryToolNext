'use client';

import { Button } from '@/components/ui/button';
import { RestApiError } from '@/query/config/config';
import { AxiosError } from 'axios';

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

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl capitalize">{message}</h2>
      <div className="grid items-center justify-center gap-2">
        <Button title="reset" onClick={() => reset()}>
          Try again
        </Button>
        <Button title="reset" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
