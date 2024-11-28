'use client';

import { ReactNode } from 'react';

import { LayoutGridIcon, LayoutListIcon } from '@/components/common/icons';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useSession } from '@/context/session-context.client';
import { PaginationType, paginationTypes } from '@/context/session-context.type';

type Props = {
  children: ReactNode;
};

export function PaginationLayoutSwitcher() {
  const {
    config: { paginationType },
    setConfig,
  } = useSession();

  return (
    <ToggleGroup value={paginationType} type="single" onValueChange={(type: PaginationType) => setConfig('paginationType', paginationTypes.includes(type) ? type : 'grid')}>
      <ToggleGroupItem className="aspect-square" value="grid" title="grid">
        <LayoutGridIcon className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem className="aspect-square" value="infinite-scroll" title="infinite scroll">
        <LayoutListIcon className="size-5" />
      </ToggleGroupItem>
    </ToggleGroup>
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
