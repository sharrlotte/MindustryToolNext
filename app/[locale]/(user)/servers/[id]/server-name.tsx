'use client';

import React from 'react';

import ColorText from '@/components/common/color-text';
import { cn } from '@/lib/utils';
import { useServerNavBar } from '@/zustand/server-nav-bar-store';

type Props = {
  name: string;
};

export default function ServerName({ name }: Props) {
  const visible = useServerNavBar((state) => state.visible);

  if (visible) {
    return (
      <div
        className={cn('w-40 overflow-hidden transition-[width] duration-200', {
          'h-0 w-0': !visible,
        })}
      >
        <ColorText text={name} />
      </div>
    );
  }
}
