'use client';

import { usePathname } from 'next/navigation';
import React, { ReactNode, useLayoutEffect } from 'react';
import { useCookies } from 'react-cookie';

import env from '@/constant/env';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';

import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LoginButton({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const t = useI18n();
  const [_ignore, setCookie] = useCookies();
  const pathname = usePathname();

  useLayoutEffect(
    () => setCookie('redirect_uri', window.location.href),
    [setCookie, pathname],
  );

  return (
    <a
      className={cn(
        'flex w-full gap-2 rounded-md border bg-brand p-2',
        className,
      )}
      href={`${env.url.api}/oauth2/discord`}
    >
      {children || (
        <>
          <ArrowRightEndOnRectangleIcon className="size-5" />
          {t('login')}
        </>
      )}
    </a>
  );
}
