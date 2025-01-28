'use client';

import { ReactNode } from 'react';

import { LayoutGridIcon, LayoutListIcon } from '@/components/common/icons';

import { useSession } from '@/context/session-context.client';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
};

export function PaginationLayoutSwitcher() {
  const {
    config: { paginationType },
    setConfig,
  } = useSession();

  return (
    <div>
      <button
        className={cn('p-2', {
          'bg-secondary rounded-md hover:bg-secondary bg-opacity-80': paginationType === 'grid',
        })}
        onClick={() => setConfig('paginationType', 'grid')}
      >
        <LayoutGridIcon className="min-w-5 min-h-5" />
      </button>
      <button
        className={cn('p-2', {
          'bg-secondary rounded-md hover:bg-secondary bg-opacity-80': paginationType === 'infinite-scroll',
        })}
        onClick={() => setConfig('paginationType', 'infinite-scroll')}
      >
        <LayoutListIcon className="min-w-5 min-h-5" />
      </button>
    </div>
  );
}

export function ListLayout({ children }: Props) {
  const {
    config: { paginationType },
  } = useSession();

  return paginationType === 'infinite-scroll' ? children : undefined;
}

export function GridLayout({ children }: Props) {
  const {
    config: { paginationType },
  } = useSession();

  return paginationType === 'grid' ? children : undefined;
}
