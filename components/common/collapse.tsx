import React, { ReactNode, useState } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  message: ReactNode;
  children: ReactNode;
};

export default function Collapse({ message, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className="w-full" title="" onClick={() => setOpen((prev) => !prev)}>
        {message}
      </button>
      <div
        className={cn('grid overflow-hidden transition-all', {
          'grid-rows-[0]': !open,
          'grid-rows-1': open,
        })}
      >
        {children}
      </div>
    </div>
  );
}
