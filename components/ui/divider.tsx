import React, { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type DividerProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export default function Divider({ className, ...props }: DividerProps) {
  return <div className={cn('h-0 border-b border-border', className)} {...props}></div>;
}
