'use client';

import React from 'react';

import LoginButton from '@/components/button/login-button';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user/user-avatar';

import { useSession } from '@/context/session-context';

export default function HorizontalNavbarUserAvatar() {
  const { session, state } = useSession();

  if (state === 'loading') {
    return <Skeleton className="block h-8 w-8 rounded-full border border-border" />;
  }

  if (session === null) {
    return <LoginButton className="w-fit" />;
  }

  return <UserAvatar user={session} url="/users/@me" />;
}
