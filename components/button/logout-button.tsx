'use client';

import env from '@/constant/env';
import { cn } from '@/lib/utils';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import React from 'react';

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <a className={cn(className)} href={`${env.url.api}/auth/logout`}>
      <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
    </a>
  );
}
