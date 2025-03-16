'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import StarScene from '@/components/common/star-scene';

import useClientApi from '@/hooks/use-client';
import { TError, getErrorMessage, getLoggedErrorMessage } from '@/lib/utils';
import { reportError } from '@/query/api';

import * as Sentry from '@sentry/nextjs';

import './globals.css';

export default function Error({ error }: { error: TError }) {
  const message = getErrorMessage(error);
  const loggedMessage = getLoggedErrorMessage(error);

  const path = usePathname();
  const axios = useClientApi();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  useEffect(() => {
    reportError(axios, `${path} > ${loggedMessage}`);
  }, [axios, message, path, loggedMessage]);

  return (
    <div className="h-full w-full bg-black">
      <StarScene message={message} />
    </div>
  );
}
