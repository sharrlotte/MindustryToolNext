import React, { Suspense } from 'react';

import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import ReloadServerDialog from '@/app/[locale]/(user)/servers/reload-server-dialog';
import InternalServerCardSkeleton from '@/components/server/internal-server-card-skeleton';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorScreen from '@/components/common/error-screen';
import { Servers } from '@/app/[locale]/(admin)/admin/servers/server-list';

export const experimental_ppr = true;

const skeleton = (
  <div className="grid gap-2 overflow-y-auto pr-1 md:grid-cols-2 lg:grid-cols-3">
    {Array(8)
      .fill(1)
      .map((_, index) => (
        <InternalServerCardSkeleton key={index} />
      ))}
  </div>
);

export default async function Page() {
  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-4">
      <div className="flex justify-end gap-2 rounded-md bg-card p-2">
        <ReloadServerDialog />
        <CreateServerDialog />
      </div>
      <ErrorBoundary FallbackComponent={ErrorScreen}>
        <Suspense fallback={skeleton}>
          <Servers />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
