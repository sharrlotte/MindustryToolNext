'use client';

import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
import { useCookies } from 'react-cookie';

import env from '@/constant/env';
import { cn } from '@/lib/utils';

export default function LogoutButton({ className }: { className?: string }) {
  const [_, setCookie] = useCookies();
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!window.location.href.includes('login')) {
      setCookie('redirect_uri', window.location.href, { path: '/' });
    }
  }, [setCookie, pathname]);

  return (
    <a className={cn(className)} href={`${env.url.api}/auth/logout`}>
      <LogOut className="size-5" />
    </a>
  );
}
