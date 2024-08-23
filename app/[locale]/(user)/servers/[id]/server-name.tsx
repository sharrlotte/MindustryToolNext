'use client';

import React from 'react';

import ColorText from '@/components/common/color-text';
import { cn } from '@/lib/utils';
import { useExpandServerNav } from '@/zustand/expand-nav';

type Props = {
  name: string;
};

export default function ServerName({ name }: Props) {
  const expand = useExpandServerNav((state) => state.expand);

  if (expand) {
    return (
      <div
        className={cn('w-40 transition-[width] duration-200 overflow-hidden', {
          'w-0 h-0': !expand,
        })}
      >
        <ColorText text={name} />
      </div>
    );
  }
}
