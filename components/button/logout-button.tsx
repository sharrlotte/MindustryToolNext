'use client';

import { usePathname } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
import { useCookies } from 'react-cookie';

import env from '@/constant/env';
import { cn } from '@/lib/utils';

import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LogoutButton({ className }: { className?: string }) {
  const [_, setCookie] = useCookies();
  const pathname = usePathname();

  useLayoutEffect(
    () => setCookie('redirect_uri', window.location.href),
    [setCookie, pathname],
  );

  return (
    <a className={cn(className)} href={`${env.url.api}/auth/logout`}>
      <ArrowRightStartOnRectangleIcon className="size-5" />
    </a>
  );
}
