'use client';

import { usePathname } from 'next/navigation';
import React, { ReactNode, useLayoutEffect } from 'react';
import { useCookies } from 'react-cookie';

import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/client';

import { LogIn } from 'lucide-react';
import InternalLink from '@/components/common/internal-link';

const ignored = ['login'];

export default function LoginButton({ className, children }: { className?: string; children?: ReactNode }) {
  const t = useI18n();
  const [_ignore, setCookie] = useCookies();
  const pathname = usePathname();

  useLayoutEffect(() => {
    const path = window.location.href;

    if (!ignored.some((ig) => pathname.includes(ig))) {
      setCookie('redirect_uri', path, {
        path: '/',
      });
    }
  }, [setCookie, pathname]);

  return (
    <InternalLink className={cn('flex w-full items-center justify-center gap-1 rounded-md bg-brand p-2 text-sm', className)} href="/auth/login">
      {children || (
        <>
          <LogIn className="size-5" />
          {t('login')}
        </>
      )}
    </InternalLink>
  );
}
