'use client';

import { ChevronRight } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';
import { useServerNavBar } from '@/zustand/server-nav-bar-store';


export default function SidebarToggle() {
  const { visible, setVisible } = useServerNavBar();

  return (
    <div className="flex h-9 w-full items-center justify-center">
      <div
        className={cn('flex cursor-pointer items-center justify-center rounded-sm p-2 transition-transform duration-200 hover:bg-brand hover:text-white', {
          'rotate-180': !visible,
        })}
        onClick={() => setVisible(!visible)}
      >
        <ChevronRight className="size-5" />
      </div>
    </div>
  );
}
