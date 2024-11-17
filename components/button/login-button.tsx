'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useLayoutEffect } from 'react';
import { useCookies } from 'react-cookie';

import { cn } from '@/lib/utils';

import InternalLink from '@/components/common/internal-link';
import { LogIn } from 'lucide-react';
import Tran from '@/components/common/tran';

const ignored = ['login'];

export default function LoginButton({ className, children }: { className?: string; children?: ReactNode }) {
  const [_ignore, setCookie] = useCookies();
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!ignored.some((ig) => pathname.includes(ig))) {
      setCookie('redirect_uri', window.location.href, {
        path: '/',
      });
    }
  }, [setCookie, pathname]);

  return (
    <InternalLink className={cn('flex w-full items-center justify-center gap-1 rounded-md bg-brand p-2 text-sm', className)} href="/auth/login">
      {children || (
        <>
          <LogIn className="size-5" />
          <Tran text="login" />
        </>
      )}
    </InternalLink>
  );
}
