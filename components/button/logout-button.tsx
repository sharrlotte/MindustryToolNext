'use client';

import env from '@/constant/env';
import { cn } from '@/lib/utils';

import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import React, { useLayoutEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function LogoutButton({ className }: { className?: string }) {
  const [_, setCookie] = useCookies();

  useLayoutEffect(
    () => setCookie('redirect_uri', `${env.url.base}`),
    [setCookie],
  );

  return (
    <a className={cn(className)} href={`${env.url.api}/auth/logout`}>
      <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
    </a>
  );
}
